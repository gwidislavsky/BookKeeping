import mongoose from 'mongoose';
import { Expense, IExpense } from '../models/Expense';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Expense Model Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Expense.deleteMany({});
  });

  describe('Expense Schema Validation', () => {
    it('should create a valid expense with all fields', async () => {
      const expenseData = {
        referenceNumber: 2001,
        date: new Date('2024-01-01'),
        supplier: new mongoose.Types.ObjectId(),
        category: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
        amount: 1000,
        vat: 170,
        paymentMethod: 'cash' as const,
        details: 'Office supplies',
        referenceDoc: 'REF001',
        paymentDetails: {
          last4Digits: '1234',
          paymentsCount: 1
        }
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();

      expect(savedExpense._id).toBeDefined();
      expect(savedExpense.referenceNumber).toBe(2001);
      expect(savedExpense.amount).toBe(1000);
      expect(savedExpense.vat).toBe(170);
      expect(savedExpense.paymentMethod).toBe('cash');
    });

    it('should fail to create expense without required fields', async () => {
      const expenseData = {
        referenceNumber: 2001,
        date: new Date('2024-01-01'),
        amount: 1000,
        vat: 170,
        paymentMethod: 'cash' as const
        // missing supplier and category
      };

      const expense = new Expense(expenseData);
      await expect(expense.save()).rejects.toThrow();
    });

    it('should enforce unique reference number', async () => {
      const expenseData1 = {
        referenceNumber: 2001,
        date: new Date('2024-01-01'),
        supplier: new mongoose.Types.ObjectId(),
        category: new mongoose.Types.ObjectId(),
        amount: 1000,
        vat: 170,
        paymentMethod: 'cash' as const
      };

      const expenseData2 = {
        referenceNumber: 2001, // same reference number
        date: new Date('2024-01-02'),
        supplier: new mongoose.Types.ObjectId(),
        category: new mongoose.Types.ObjectId(),
        amount: 500,
        vat: 85,
        paymentMethod: 'credit' as const
      };

      const expense1 = new Expense(expenseData1);
      await expense1.save();

      const expense2 = new Expense(expenseData2);
      await expect(expense2.save()).rejects.toThrow();
    });

    it('should validate payment method enum', async () => {
      const expenseData = {
        referenceNumber: 2001,
        date: new Date('2024-01-01'),
        supplier: new mongoose.Types.ObjectId(),
        category: new mongoose.Types.ObjectId(),
        amount: 1000,
        vat: 170,
        paymentMethod: 'invalid_method' as any
      };

      const expense = new Expense(expenseData);
      await expect(expense.save()).rejects.toThrow();
    });
  });

  describe('Expense Database Operations', () => {
    it('should find expenses by supplier', async () => {
      const supplierId = new mongoose.Types.ObjectId();
      const categoryId = new mongoose.Types.ObjectId();

      await Expense.create([
        {
          referenceNumber: 2001,
          date: new Date('2024-01-01'),
          supplier: supplierId,
          category: categoryId,
          amount: 1000,
          vat: 170,
          paymentMethod: 'cash'
        },
        {
          referenceNumber: 2002,
          date: new Date('2024-01-02'),
          supplier: new mongoose.Types.ObjectId(),
          category: categoryId,
          amount: 500,
          vat: 85,
          paymentMethod: 'credit'
        }
      ]);

      const expensesForSupplier = await Expense.find({ supplier: supplierId });
      
      expect(expensesForSupplier).toHaveLength(1);
      expect(expensesForSupplier[0].referenceNumber).toBe(2001);
    });

    it('should update expense information', async () => {
      const expense = await Expense.create({
        referenceNumber: 2001,
        date: new Date('2024-01-01'),
        supplier: new mongoose.Types.ObjectId(),
        category: new mongoose.Types.ObjectId(),
        amount: 1000,
        vat: 170,
        paymentMethod: 'cash'
      });

      const updatedExpense = await Expense.findByIdAndUpdate(
        expense._id,
        { 
          amount: 1200,
          vat: 204,
          details: 'Updated expense'
        },
        { new: true }
      );

      expect(updatedExpense?.amount).toBe(1200);
      expect(updatedExpense?.vat).toBe(204);
      expect(updatedExpense?.details).toBe('Updated expense');
    });
  });
});
