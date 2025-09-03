import request from 'supertest';
import app from '../app';
import { Income } from '../models/Income';

// Mock של מודל Income כדי לא לפגוע בדאטבייס האמיתי
jest.mock('../models/Income');

const MockedIncome = Income as jest.Mocked<typeof Income>;

// Mock של populate function
const createMockPopulate = (result: any) => ({
  populate: jest.fn().mockResolvedValue(result)
});

describe('Income Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/incomes', () => {
    it('should create a new income successfully', async () => {
      const mockIncome = {
        _id: 'mockId123',
        receiptNumber: 1001,
        date: new Date('2024-01-01'),
        client: 'clientId123',
        user: 'userId123',
        amount: 1000,
        vat: 170,
        paymentMethod: 'cash',
        details: 'Service payment',
        paymentDetails: {},
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedIncome as any).mockImplementation(() => mockIncome);

      const response = await request(app)
        .post('/api/incomes')
        .send({
          receiptNumber: 1001,
          date: '2024-01-01',
          client: 'clientId123',
          user: 'userId123',
          amount: 1000,
          vat: 170,
          paymentMethod: 'cash',
          details: 'Service payment'
        });

      expect(response.status).toBe(201);
      expect(mockIncome.save).toHaveBeenCalled();
    });

    it('should create income with credit card payment details', async () => {
      const mockIncome = {
        _id: 'mockId123',
        receiptNumber: 1002,
        date: new Date('2024-01-01'),
        client: 'clientId123',
        amount: 500,
        vat: 85,
        paymentMethod: 'credit',
        paymentDetails: {
          last4Digits: '1234',
          paymentsCount: 3
        },
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedIncome as any).mockImplementation(() => mockIncome);

      const response = await request(app)
        .post('/api/incomes')
        .send({
          receiptNumber: 1002,
          date: '2024-01-01',
          client: 'clientId123',
          amount: 500,
          vat: 85,
          paymentMethod: 'credit',
          paymentDetails: {
            last4Digits: '1234',
            paymentsCount: 3
          }
        });

      expect(response.status).toBe(201);
      expect(mockIncome.save).toHaveBeenCalled();
    });

    it('should fail to create income without required fields', async () => {
      const mockIncome = {
        save: jest.fn().mockRejectedValue(new Error('Path `receiptNumber` is required.'))
      };

      (MockedIncome as any).mockImplementation(() => mockIncome);

      const response = await request(app)
        .post('/api/incomes')
        .send({
          date: '2024-01-01',
          client: 'clientId123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `receiptNumber` is required.');
    });

    it('should handle duplicate receipt number error', async () => {
      const mockIncome = {
        save: jest.fn().mockRejectedValue(new Error('E11000 duplicate key error'))
      };

      (MockedIncome as any).mockImplementation(() => mockIncome);

      const response = await request(app)
        .post('/api/incomes')
        .send({
          receiptNumber: 1001,
          date: '2024-01-01',
          client: 'clientId123',
          amount: 1000,
          vat: 170,
          paymentMethod: 'cash'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('E11000 duplicate key error');
    });
  });

  describe('GET /api/incomes', () => {
    it('should get all incomes successfully', async () => {
      const mockIncomes = [
        { 
          _id: '1', 
          receiptNumber: 1001, 
          amount: 1000, 
          paymentMethod: 'cash',
          client: { name: 'Client 1' },
          user: { username: 'user1' }
        },
        { 
          _id: '2', 
          receiptNumber: 1002, 
          amount: 500, 
          paymentMethod: 'credit',
          client: { name: 'Client 2' },
          user: { username: 'user2' }
        }
      ];

      MockedIncome.find = jest.fn().mockReturnValue(createMockPopulate(mockIncomes));

      const response = await request(app).get('/api/incomes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIncomes);
      expect(MockedIncome.find).toHaveBeenCalled();
    });

    it('should handle database errors when fetching incomes', async () => {
      MockedIncome.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app).get('/api/incomes');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/incomes/:id', () => {
    it('should get an income by id successfully', async () => {
      const mockIncome = {
        _id: 'mockId123',
        receiptNumber: 1001,
        amount: 1000,
        paymentMethod: 'cash',
        client: { name: 'Client 1' },
        user: { username: 'user1' }
      };

      MockedIncome.findById = jest.fn().mockReturnValue(createMockPopulate(mockIncome));

      const response = await request(app).get('/api/incomes/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIncome);
      expect(MockedIncome.findById).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent income', async () => {
      MockedIncome.findById = jest.fn().mockReturnValue(createMockPopulate(null));

      const response = await request(app).get('/api/incomes/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Income not found');
    });

    it('should handle database errors when finding income by id', async () => {
      MockedIncome.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app).get('/api/incomes/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('PUT /api/incomes/:id', () => {
    it('should update an income successfully', async () => {
      const updatedIncome = {
        _id: 'mockId123',
        receiptNumber: 1001,
        amount: 1200,
        paymentMethod: 'credit',
        details: 'Updated service payment'
      };

      MockedIncome.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedIncome);

      const response = await request(app)
        .put('/api/incomes/mockId123')
        .send({
          amount: 1200,
          paymentMethod: 'credit',
          details: 'Updated service payment'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedIncome);
      expect(MockedIncome.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockId123',
        {
          amount: 1200,
          paymentMethod: 'credit',
          details: 'Updated service payment'
        },
        { new: true }
      );
    });

    it('should return 404 for non-existent income', async () => {
      MockedIncome.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/incomes/nonexistentId')
        .send({
          amount: 1200
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Income not found');
    });

    it('should handle database errors during update', async () => {
      MockedIncome.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/incomes/mockId123')
        .send({
          amount: 1200
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('DELETE /api/incomes/:id', () => {
    it('should delete an income successfully', async () => {
      const deletedIncome = {
        _id: 'mockId123',
        receiptNumber: 1001,
        amount: 1000
      };

      MockedIncome.findByIdAndDelete = jest.fn().mockResolvedValue(deletedIncome);

      const response = await request(app).delete('/api/incomes/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Income deleted');
      expect(MockedIncome.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent income', async () => {
      MockedIncome.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/incomes/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Income not found');
    });

    it('should handle database errors during deletion', async () => {
      MockedIncome.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/incomes/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });
});
