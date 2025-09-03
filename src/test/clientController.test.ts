import request from 'supertest';
import app from '../app';
import { Client } from '../models/Client';

// Mock של מודל Client כדי לא לפגוע בדאטבייס האמיתי
jest.mock('../models/Client');

const MockedClient = Client as jest.Mocked<typeof Client>;

describe('Client Controller Tests', () => {
  // לפני כל בדיקה נוודא שהmocks נקיים
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/clients', () => {
    it('should create a new client successfully', async () => {
      const mockClient = {
        _id: 'mockId123',
        name: 'John Doe',
        phone: '123-456-7890',
        email: 'john@example.com',
        address: '123 Main St',
        companyId: '123456789',
        type: 'private',
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock constructor של Client
      (MockedClient as any).mockImplementation(() => mockClient);

      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'John Doe',
          phone: '123-456-7890',
          email: 'john@example.com',
          address: '123 Main St',
          companyId: '123456789',
          type: 'private'
        });

      expect(response.status).toBe(201);
      expect(mockClient.save).toHaveBeenCalled();
    });

    it('should create a client with minimal data (only name)', async () => {
      const mockClient = {
        _id: 'mockId123',
        name: 'Jane Doe',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedClient as any).mockImplementation(() => mockClient);

      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'Jane Doe'
        });

      expect(response.status).toBe(201);
      expect(mockClient.save).toHaveBeenCalled();
    });

    it('should fail to create client without name', async () => {
      const mockClient = {
        save: jest.fn().mockRejectedValue(new Error('Path `name` is required.'))
      };

      (MockedClient as any).mockImplementation(() => mockClient);

      const response = await request(app)
        .post('/api/clients')
        .send({
          phone: '123-456-7890'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `name` is required.');
    });

    it('should handle database errors during creation', async () => {
      const mockClient = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (MockedClient as any).mockImplementation(() => mockClient);

      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'John Doe',
          email: 'john@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/clients', () => {
    it('should get all clients successfully', async () => {
      const mockClients = [
        { _id: '1', name: 'John Doe', phone: '123-456-7890', type: 'private' },
        { _id: '2', name: 'Acme Corp', email: 'contact@acme.com', type: 'business' }
      ];

      MockedClient.find = jest.fn().mockResolvedValue(mockClients);

      const response = await request(app).get('/api/clients');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClients);
      expect(MockedClient.find).toHaveBeenCalled();
    });

    it('should handle database errors when fetching clients', async () => {
      MockedClient.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/clients');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should get a client by id successfully', async () => {
      const mockClient = {
        _id: 'mockId123',
        name: 'John Doe',
        phone: '123-456-7890',
        email: 'john@example.com',
        type: 'private'
      };

      MockedClient.findById = jest.fn().mockResolvedValue(mockClient);

      const response = await request(app).get('/api/clients/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClient);
      expect(MockedClient.findById).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent client', async () => {
      MockedClient.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/clients/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Client not found');
    });

    it('should handle database errors when finding client by id', async () => {
      MockedClient.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/clients/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('PUT /api/clients/:id', () => {
    it('should update a client successfully', async () => {
      const updatedClient = {
        _id: 'mockId123',
        name: 'John Updated',
        phone: '999-888-7777',
        email: 'john.updated@example.com',
        type: 'business'
      };

      MockedClient.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedClient);

      const response = await request(app)
        .put('/api/clients/mockId123')
        .send({
          name: 'John Updated',
          phone: '999-888-7777',
          email: 'john.updated@example.com',
          type: 'business'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedClient);
      expect(MockedClient.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockId123',
        {
          name: 'John Updated',
          phone: '999-888-7777',
          email: 'john.updated@example.com',
          type: 'business'
        },
        { new: true }
      );
    });

    it('should return 404 for non-existent client', async () => {
      MockedClient.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/clients/nonexistentId')
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Client not found');
    });

    it('should handle database errors during update', async () => {
      MockedClient.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/clients/mockId123')
        .send({
          name: 'John Updated'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should delete a client successfully', async () => {
      const deletedClient = {
        _id: 'mockId123',
        name: 'John Doe',
        email: 'john@example.com'
      };

      MockedClient.findByIdAndDelete = jest.fn().mockResolvedValue(deletedClient);

      const response = await request(app).delete('/api/clients/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Client deleted');
      expect(MockedClient.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent client', async () => {
      MockedClient.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/clients/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Client not found');
    });

    it('should handle database errors during deletion', async () => {
      MockedClient.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/clients/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });
});
