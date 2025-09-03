import request from 'supertest';
import app from '../app';
import { Expense } from '../models/Expense';

jest.mock('../models/Expense');
const MockedExpense = Expense as jest.Mocked<typeof Expense>;

const createMockPopulate = (result: any) => ({
  populate: jest.fn().mockResolvedValue(result)
});

describe('Expense Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/expenses', () => {
    it('should create a new expense successfully', async () => {
      const mockExpense = {
        _id: 'mockId123',
        referenceNumber: 2001,
        date: new Date('2024-01-01'),
        supplier: 'supplierId123',
        category: 'categoryId123',
        user: 'userId123',
        amount: 1000,
        vat: 170,
        paymentMethod: 'cash',
        details: 'Office supplies',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedExpense as any).mockImplementation(() => mockExpense);

      const response = await request(app)
        .post('/api/expenses')
        .send({
          referenceNumber: 2001,
          date: '2024-01-01',
          supplier: 'supplierId123',
          category: 'categoryId123',
          user: 'userId123',
          amount: 1000,
          vat: 170,
          paymentMethod: 'cash',
          details: 'Office supplies'
        });

      expect(response.status).toBe(201);
      expect(mockExpense.save).toHaveBeenCalled();
    });

    it('should fail to create expense without required fields', async () => {
      const mockExpense = {
        save: jest.fn().mockRejectedValue(new Error('Path `supplier` is required.'))
      };

      (MockedExpense as any).mockImplementation(() => mockExpense);

      const response = await request(app)
        .post('/api/expenses')
        .send({
          referenceNumber: 2001,
          date: '2024-01-01',
          amount: 1000,
          vat: 170,
          paymentMethod: 'cash'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `supplier` is required.');
    });
  });

  describe('GET /api/expenses', () => {
    it('should get all expenses successfully', async () => {
      const mockExpenses = [
        { 
          _id: '1', 
          referenceNumber: 2001, 
          amount: 1000, 
          paymentMethod: 'cash',
          supplier: { name: 'Supplier 1' },
          category: { name: 'Office' }
        }
      ];

      MockedExpense.find = jest.fn().mockReturnValue(createMockPopulate(mockExpenses));

      const response = await request(app).get('/api/expenses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExpenses);
    });
  });

  describe('GET /api/expenses/:id', () => {
    it('should get expense by id successfully', async () => {
      const mockExpense = {
        _id: 'mockId123',
        referenceNumber: 2001,
        amount: 1000,
        supplier: { name: 'Supplier 1' }
      };

      MockedExpense.findById = jest.fn().mockReturnValue(createMockPopulate(mockExpense));

      const response = await request(app).get('/api/expenses/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExpense);
    });

    it('should return 404 for non-existent expense', async () => {
      MockedExpense.findById = jest.fn().mockReturnValue(createMockPopulate(null));

      const response = await request(app).get('/api/expenses/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Expense not found');
    });
  });

  describe('PUT /api/expenses/:id', () => {
    it('should update expense successfully', async () => {
      const updatedExpense = {
        _id: 'mockId123',
        referenceNumber: 2001,
        amount: 1200,
        details: 'Updated expense'
      };

      MockedExpense.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedExpense);

      const response = await request(app)
        .put('/api/expenses/mockId123')
        .send({ amount: 1200, details: 'Updated expense' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedExpense);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('should delete expense successfully', async () => {
      const deletedExpense = {
        _id: 'mockId123',
        referenceNumber: 2001
      };

      MockedExpense.findByIdAndDelete = jest.fn().mockResolvedValue(deletedExpense);

      const response = await request(app).delete('/api/expenses/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Expense deleted');
    });
  });
});
