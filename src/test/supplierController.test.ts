import request from 'supertest';
import app from '../app';
import { Supplier } from '../models/Supplier';

// Mock של מודל Supplier כדי לא לפגוע בדאטבייס האמיתי
jest.mock('../models/Supplier');

const MockedSupplier = Supplier as jest.Mocked<typeof Supplier>;

describe('Supplier Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/suppliers', () => {
    it('should create a new supplier successfully', async () => {
      const mockSupplier = {
        _id: 'mockId123',
        name: 'Office Supply Co',
        phone: '123-456-7890',
        email: 'contact@officesupply.com',
        address: '456 Business St',
        companyId: '987654321',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedSupplier as any).mockImplementation(() => mockSupplier);

      const response = await request(app)
        .post('/api/suppliers')
        .send({
          name: 'Office Supply Co',
          phone: '123-456-7890',
          email: 'contact@officesupply.com',
          address: '456 Business St',
          companyId: '987654321'
        });

      expect(response.status).toBe(201);
      expect(mockSupplier.save).toHaveBeenCalled();
    });

    it('should create a supplier with minimal data (only name)', async () => {
      const mockSupplier = {
        _id: 'mockId123',
        name: 'Simple Supplier',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedSupplier as any).mockImplementation(() => mockSupplier);

      const response = await request(app)
        .post('/api/suppliers')
        .send({
          name: 'Simple Supplier'
        });

      expect(response.status).toBe(201);
      expect(mockSupplier.save).toHaveBeenCalled();
    });

    it('should fail to create supplier without name', async () => {
      const mockSupplier = {
        save: jest.fn().mockRejectedValue(new Error('Path `name` is required.'))
      };

      (MockedSupplier as any).mockImplementation(() => mockSupplier);

      const response = await request(app)
        .post('/api/suppliers')
        .send({
          phone: '123-456-7890'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `name` is required.');
    });

    it('should handle database errors during creation', async () => {
      const mockSupplier = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (MockedSupplier as any).mockImplementation(() => mockSupplier);

      const response = await request(app)
        .post('/api/suppliers')
        .send({
          name: 'Test Supplier'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/suppliers', () => {
    it('should get all suppliers successfully', async () => {
      const mockSuppliers = [
        { _id: '1', name: 'Office Supply Co', email: 'office@supply.com' },
        { _id: '2', name: 'Tech Supplier', phone: '555-0123' }
      ];

      MockedSupplier.find = jest.fn().mockResolvedValue(mockSuppliers);

      const response = await request(app).get('/api/suppliers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSuppliers);
      expect(MockedSupplier.find).toHaveBeenCalled();
    });

    it('should handle database errors when fetching suppliers', async () => {
      MockedSupplier.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/suppliers');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/suppliers/:id', () => {
    it('should get a supplier by id successfully', async () => {
      const mockSupplier = {
        _id: 'mockId123',
        name: 'Office Supply Co',
        phone: '123-456-7890',
        email: 'contact@officesupply.com'
      };

      MockedSupplier.findById = jest.fn().mockResolvedValue(mockSupplier);

      const response = await request(app).get('/api/suppliers/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSupplier);
      expect(MockedSupplier.findById).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent supplier', async () => {
      MockedSupplier.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/suppliers/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Supplier not found');
    });

    it('should handle database errors when finding supplier by id', async () => {
      MockedSupplier.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/suppliers/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('PUT /api/suppliers/:id', () => {
    it('should update a supplier successfully', async () => {
      const updatedSupplier = {
        _id: 'mockId123',
        name: 'Updated Supply Co',
        phone: '999-888-7777',
        email: 'updated@supply.com'
      };

      MockedSupplier.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedSupplier);

      const response = await request(app)
        .put('/api/suppliers/mockId123')
        .send({
          name: 'Updated Supply Co',
          phone: '999-888-7777',
          email: 'updated@supply.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedSupplier);
      expect(MockedSupplier.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockId123',
        {
          name: 'Updated Supply Co',
          phone: '999-888-7777',
          email: 'updated@supply.com'
        },
        { new: true }
      );
    });

    it('should return 404 for non-existent supplier', async () => {
      MockedSupplier.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/suppliers/nonexistentId')
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Supplier not found');
    });

    it('should handle database errors during update', async () => {
      MockedSupplier.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/suppliers/mockId123')
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('DELETE /api/suppliers/:id', () => {
    it('should delete a supplier successfully', async () => {
      const deletedSupplier = {
        _id: 'mockId123',
        name: 'Office Supply Co',
        email: 'contact@officesupply.com'
      };

      MockedSupplier.findByIdAndDelete = jest.fn().mockResolvedValue(deletedSupplier);

      const response = await request(app).delete('/api/suppliers/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Supplier deleted');
      expect(MockedSupplier.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent supplier', async () => {
      MockedSupplier.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/suppliers/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Supplier not found');
    });

    it('should handle database errors during deletion', async () => {
      MockedSupplier.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/suppliers/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });
});
