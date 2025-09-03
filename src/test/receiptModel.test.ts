import mongoose from 'mongoose';
import { Receipt, IReceipt } from '../models/Receipt';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Receipt Model Tests', () => {
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
    await Receipt.deleteMany({});
  });

  describe('Receipt Schema Validation', () => {
    it('should create a valid receipt with all fields', async () => {
      const receiptData = {
        date: new Date('2024-01-01'),
        amount: 500,
        clientName: 'John Doe',
        description: 'Consulting services'
      };

      const receipt = new Receipt(receiptData);
      const savedReceipt = await receipt.save();

      expect(savedReceipt._id).toBeDefined();
      expect(savedReceipt.date).toEqual(new Date('2024-01-01'));
      expect(savedReceipt.amount).toBe(500);
      expect(savedReceipt.clientName).toBe('John Doe');
      expect(savedReceipt.description).toBe('Consulting services');
    });

    it('should create a receipt without description', async () => {
      const receiptData = {
        date: new Date('2024-01-01'),
        amount: 300,
        clientName: 'Jane Smith'
      };

      const receipt = new Receipt(receiptData);
      const savedReceipt = await receipt.save();

      expect(savedReceipt._id).toBeDefined();
      expect(savedReceipt.clientName).toBe('Jane Smith');
      expect(savedReceipt.amount).toBe(300);
      expect(savedReceipt.description).toBeUndefined();
    });

    it('should fail to create receipt without date', async () => {
      const receiptData = {
        amount: 500,
        clientName: 'John Doe'
      };

      const receipt = new Receipt(receiptData);
      await expect(receipt.save()).rejects.toThrow();
    });

    it('should fail to create receipt without amount', async () => {
      const receiptData = {
        date: new Date('2024-01-01'),
        clientName: 'John Doe'
      };

      const receipt = new Receipt(receiptData);
      await expect(receipt.save()).rejects.toThrow();
    });

    it('should fail to create receipt without clientName', async () => {
      const receiptData = {
        date: new Date('2024-01-01'),
        amount: 500
      };

      const receipt = new Receipt(receiptData);
      await expect(receipt.save()).rejects.toThrow();
    });
  });

  describe('Receipt Database Operations', () => {
    it('should find receipts by client name', async () => {
      await Receipt.create([
        {
          date: new Date('2024-01-01'),
          amount: 500,
          clientName: 'John Doe',
          description: 'Service A'
        },
        {
          date: new Date('2024-01-02'),
          amount: 300,
          clientName: 'Jane Smith',
          description: 'Service B'
        },
        {
          date: new Date('2024-01-03'),
          amount: 750,
          clientName: 'John Doe',
          description: 'Service C'
        }
      ]);

      const johnDoeReceipts = await Receipt.find({ clientName: 'John Doe' });
      
      expect(johnDoeReceipts).toHaveLength(2);
      expect(johnDoeReceipts[0].clientName).toBe('John Doe');
      expect(johnDoeReceipts[1].clientName).toBe('John Doe');
      
      const amounts = johnDoeReceipts.map(r => r.amount);
      expect(amounts).toContain(500);
      expect(amounts).toContain(750);
    });

    it('should find receipts by date range', async () => {
      await Receipt.create([
        {
          date: new Date('2024-01-01'),
          amount: 500,
          clientName: 'Client A'
        },
        {
          date: new Date('2024-01-15'),
          amount: 300,
          clientName: 'Client B'
        },
        {
          date: new Date('2024-02-01'),
          amount: 750,
          clientName: 'Client C'
        }
      ]);

      const januaryReceipts = await Receipt.find({
        date: {
          $gte: new Date('2024-01-01'),
          $lt: new Date('2024-02-01')
        }
      });
      
      expect(januaryReceipts).toHaveLength(2);
    });

    it('should update receipt information', async () => {
      const receipt = await Receipt.create({
        date: new Date('2024-01-01'),
        amount: 500,
        clientName: 'John Doe',
        description: 'Original description'
      });

      const updatedReceipt = await Receipt.findByIdAndUpdate(
        receipt._id,
        { 
          amount: 600,
          description: 'Updated description'
        },
        { new: true }
      );

      expect(updatedReceipt?.amount).toBe(600);
      expect(updatedReceipt?.description).toBe('Updated description');
      expect(updatedReceipt?.clientName).toBe('John Doe'); // unchanged
    });

    it('should delete a receipt', async () => {
      const receipt = await Receipt.create({
        date: new Date('2024-01-01'),
        amount: 500,
        clientName: 'John Doe'
      });

      await Receipt.findByIdAndDelete(receipt._id);

      const deletedReceipt = await Receipt.findById(receipt._id);
      expect(deletedReceipt).toBeNull();
    });

    it('should get all receipts', async () => {
      await Receipt.create([
        {
          date: new Date('2024-01-01'),
          amount: 500,
          clientName: 'Client A'
        },
        {
          date: new Date('2024-01-02'),
          amount: 300,
          clientName: 'Client B'
        },
        {
          date: new Date('2024-01-03'),
          amount: 750,
          clientName: 'Client C'
        }
      ]);

      const allReceipts = await Receipt.find({});
      
      expect(allReceipts).toHaveLength(3);
      
      const clientNames = allReceipts.map(receipt => receipt.clientName);
      expect(clientNames).toContain('Client A');
      expect(clientNames).toContain('Client B');
      expect(clientNames).toContain('Client C');
    });

    it('should find receipts with amount greater than specified value', async () => {
      await Receipt.create([
        {
          date: new Date('2024-01-01'),
          amount: 200,
          clientName: 'Small Client'
        },
        {
          date: new Date('2024-01-02'),
          amount: 600,
          clientName: 'Big Client'
        },
        {
          date: new Date('2024-01-03'),
          amount: 1000,
          clientName: 'Large Client'
        }
      ]);

      const largeReceipts = await Receipt.find({ amount: { $gte: 500 } });
      
      expect(largeReceipts).toHaveLength(2);
      expect(largeReceipts.map(r => r.clientName)).toContain('Big Client');
      expect(largeReceipts.map(r => r.clientName)).toContain('Large Client');
    });
  });
});
