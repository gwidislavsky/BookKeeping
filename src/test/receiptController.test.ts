import request from 'supertest';
import app from '../app';
import { Receipt } from '../models/Receipt';

jest.mock('../models/Receipt');
const MockedReceipt = Receipt as jest.Mocked<typeof Receipt>;

describe('Receipt Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/receipts', () => {
    it('should create a new receipt successfully', async () => {
      const mockReceipt = {
        _id: 'mockId123',
        date: new Date('2024-01-01'),
        amount: 500,
        clientName: 'John Doe',
        description: 'Service payment',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedReceipt as any).mockImplementation(() => mockReceipt);

      const response = await request(app)
        .post('/api/receipts')
        .send({
          date: '2024-01-01',
          amount: 500,
          clientName: 'John Doe',
          description: 'Service payment'
        });

      expect(response.status).toBe(201);
      expect(mockReceipt.save).toHaveBeenCalled();
    });

    it('should create receipt without description', async () => {
      const mockReceipt = {
        _id: 'mockId123',
        date: new Date('2024-01-01'),
        amount: 300,
        clientName: 'Jane Smith',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedReceipt as any).mockImplementation(() => mockReceipt);

      const response = await request(app)
        .post('/api/receipts')
        .send({
          date: '2024-01-01',
          amount: 300,
          clientName: 'Jane Smith'
        });

      expect(response.status).toBe(201);
      expect(mockReceipt.save).toHaveBeenCalled();
    });

    it('should fail to create receipt without required fields', async () => {
      const mockReceipt = {
        save: jest.fn().mockRejectedValue(new Error('Path `clientName` is required.'))
      };

      (MockedReceipt as any).mockImplementation(() => mockReceipt);

      const response = await request(app)
        .post('/api/receipts')
        .send({
          date: '2024-01-01',
          amount: 500
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `clientName` is required.');
    });
  });

  describe('GET /api/receipts', () => {
    it('should get all receipts successfully', async () => {
      const mockReceipts = [
        { _id: '1', clientName: 'John Doe', amount: 500, date: '2024-01-01' },
        { _id: '2', clientName: 'Jane Smith', amount: 300, date: '2024-01-02' }
      ];

      MockedReceipt.find = jest.fn().mockResolvedValue(mockReceipts);

      const response = await request(app).get('/api/receipts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReceipts);
    });

    it('should handle database errors when fetching receipts', async () => {
      MockedReceipt.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/receipts');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/receipts/:id', () => {
    it('should get receipt by id successfully', async () => {
      const mockReceipt = {
        _id: 'mockId123',
        clientName: 'John Doe',
        amount: 500,
        date: '2024-01-01',
        description: 'Service payment'
      };

      MockedReceipt.findById = jest.fn().mockResolvedValue(mockReceipt);

      const response = await request(app).get('/api/receipts/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReceipt);
    });

    it('should return 404 for non-existent receipt', async () => {
      MockedReceipt.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/receipts/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Receipt not found');
    });
  });

  describe('PUT /api/receipts/:id', () => {
    it('should update receipt successfully', async () => {
      const updatedReceipt = {
        _id: 'mockId123',
        clientName: 'John Doe Updated',
        amount: 600,
        description: 'Updated service payment'
      };

      MockedReceipt.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedReceipt);

      const response = await request(app)
        .put('/api/receipts/mockId123')
        .send({
          clientName: 'John Doe Updated',
          amount: 600,
          description: 'Updated service payment'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedReceipt);
    });
  });

  describe('DELETE /api/receipts/:id', () => {
    it('should delete receipt successfully', async () => {
      const deletedReceipt = {
        _id: 'mockId123',
        clientName: 'John Doe',
        amount: 500
      };

      MockedReceipt.findByIdAndDelete = jest.fn().mockResolvedValue(deletedReceipt);

      const response = await request(app).delete('/api/receipts/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Receipt deleted');
    });

    it('should return 404 for non-existent receipt', async () => {
      MockedReceipt.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/receipts/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Receipt not found');
    });
  });
});
