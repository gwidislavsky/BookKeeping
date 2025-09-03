import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

// Mock של מודל User כדי לא לפגוע בדאטבייס האמיתי
jest.mock('../models/User');

const MockedUser = User as jest.Mocked<typeof User>;

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        _id: 'mockId123',
        username: 'testuser',
        password: 'hashedpassword',
        businessType: 'זעיר',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedUser as any).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          password: 'password123',
          businessType: 'זעיר',
          email: 'test@example.com'
        });

      expect(response.status).toBe(201);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should create a user without email', async () => {
      const mockUser = {
        _id: 'mockId123',
        username: 'testuser2',
        password: 'hashedpassword',
        businessType: 'פטור',
        save: jest.fn().mockResolvedValue(true)
      };

      (MockedUser as any).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser2',
          password: 'password123',
          businessType: 'פטור'
        });

      expect(response.status).toBe(201);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should fail to create user without username', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('Path `username` is required.'))
      };

      (MockedUser as any).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          password: 'password123',
          businessType: 'זעיר'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `username` is required.');
    });

    it('should fail to create user without password', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('Path `password` is required.'))
      };

      (MockedUser as any).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          businessType: 'זעיר'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `password` is required.');
    });

    it('should fail to create user without businessType', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('Path `businessType` is required.'))
      };

      (MockedUser as any).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Path `businessType` is required.');
    });

    it('should handle duplicate username error', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('E11000 duplicate key error'))
      };

      (MockedUser as any).mockImplementation(() => mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'existinguser',
          password: 'password123',
          businessType: 'זעיר'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('E11000 duplicate key error');
    });
  });

  describe('GET /api/users', () => {
    it('should get all users successfully', async () => {
      const mockUsers = [
        { _id: '1', username: 'user1', businessType: 'זעיר', email: 'user1@test.com' },
        { _id: '2', username: 'user2', businessType: 'פטור' }
      ];

      MockedUser.find = jest.fn().mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(MockedUser.find).toHaveBeenCalled();
    });

    it('should handle database errors when fetching users', async () => {
      MockedUser.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get a user by id successfully', async () => {
      const mockUser = {
        _id: 'mockId123',
        username: 'testuser',
        businessType: 'מורשה',
        email: 'test@example.com'
      };

      MockedUser.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app).get('/api/users/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(MockedUser.findById).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent user', async () => {
      MockedUser.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/users/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle database errors when finding user by id', async () => {
      MockedUser.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user successfully', async () => {
      const updatedUser = {
        _id: 'mockId123',
        username: 'updateduser',
        businessType: 'מורשה',
        email: 'updated@example.com'
      };

      MockedUser.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/users/mockId123')
        .send({
          username: 'updateduser',
          businessType: 'מורשה',
          email: 'updated@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(MockedUser.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockId123',
        {
          username: 'updateduser',
          businessType: 'מורשה',
          email: 'updated@example.com'
        },
        { new: true }
      );
    });

    it('should return 404 for non-existent user', async () => {
      MockedUser.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/users/nonexistentId')
        .send({
          username: 'updated'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle database errors during update', async () => {
      MockedUser.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/users/mockId123')
        .send({
          username: 'updated'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user successfully', async () => {
      const deletedUser = {
        _id: 'mockId123',
        username: 'testuser',
        businessType: 'זעיר'
      };

      MockedUser.findByIdAndDelete = jest.fn().mockResolvedValue(deletedUser);

      const response = await request(app).delete('/api/users/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted');
      expect(MockedUser.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent user', async () => {
      MockedUser.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/users/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle database errors during deletion', async () => {
      MockedUser.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/users/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });
});
