import request from 'supertest';
import app from '../app';
import { Category } from '../models/Category';

// Mock של מודל Category כדי לא לפגוע בדאטבייס האמיתי
jest.mock('../models/Category');

const MockedCategory = Category as jest.Mocked<typeof Category>;

describe('Category Controller Tests', () => {
  // לפני כל בדיקה נוודא שהmocks נקיים
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/categories', () => {
    it('should create a new category successfully', async () => {
      const mockCategory = {
        _id: 'mockId123',
        name: 'Food',
        description: 'Food category',
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock שלא קיימת קטגוריה עם השם הזה
      MockedCategory.findOne = jest.fn().mockResolvedValue(null);
      
      // Mock constructor של Category
      (MockedCategory as any).mockImplementation(() => mockCategory);

      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Food',
          description: 'Food category'
        });

      expect(response.status).toBe(201);
      expect(MockedCategory.findOne).toHaveBeenCalledWith({ name: 'Food' });
      expect(mockCategory.save).toHaveBeenCalled();
    });

    it('should fail to create duplicate category', async () => {
      const existingCategory = {
        _id: 'existingId',
        name: 'Food',
        description: 'Existing food category'
      };

      // Mock שקיימת קטגוריה עם השם הזה
      MockedCategory.findOne = jest.fn().mockResolvedValue(existingCategory);

      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Food',
          description: 'Another food category'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Category already exists');
    });

    it('should handle database errors during creation', async () => {
      MockedCategory.findOne = jest.fn().mockResolvedValue(null);
      
      const mockCategory = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      
      (MockedCategory as any).mockImplementation(() => mockCategory);

      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Food',
          description: 'Food category'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories successfully', async () => {
      const mockCategories = [
        { _id: '1', name: 'Food', description: 'Food category' },
        { _id: '2', name: 'Travel', description: 'Travel category' }
      ];

      MockedCategory.find = jest.fn().mockResolvedValue(mockCategories);

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(MockedCategory.find).toHaveBeenCalled();
    });

    it('should handle database errors when fetching categories', async () => {
      MockedCategory.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get a category by id successfully', async () => {
      const mockCategory = {
        _id: 'mockId123',
        name: 'Food',
        description: 'Food category'
      };

      MockedCategory.findById = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app).get('/api/categories/mockId123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(MockedCategory.findById).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent category', async () => {
      MockedCategory.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/categories/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Category not found');
    });

    it('should handle database errors when finding category by id', async () => {
      MockedCategory.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/categories/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category successfully', async () => {
      const updatedCategory = {
        _id: 'mockId123',
        name: 'Updated Food',
        description: 'Updated description'
      };

      MockedCategory.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCategory);

      const response = await request(app)
        .put('/api/categories/mockId123')
        .send({
          name: 'Updated Food',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCategory);
      expect(MockedCategory.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockId123',
        { name: 'Updated Food', description: 'Updated description' },
        { new: true }
      );
    });

    it('should return 404 for non-existent category', async () => {
      MockedCategory.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/categories/nonexistentId')
        .send({
          name: 'Updated',
          description: 'Updated'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Category not found');
    });

    it('should handle database errors during update', async () => {
      MockedCategory.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/categories/mockId123')
        .send({
          name: 'Updated Food',
          description: 'Updated description'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category successfully', async () => {
      const deletedCategory = {
        _id: 'mockId123',
        name: 'Food',
        description: 'Food category'
      };

      MockedCategory.findByIdAndDelete = jest.fn().mockResolvedValue(deletedCategory);

      const response = await request(app).delete('/api/categories/mockId123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Category deleted');
      expect(MockedCategory.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
    });

    it('should return 404 for non-existent category', async () => {
      MockedCategory.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/categories/nonexistentId');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Category not found');
    });

    it('should handle database errors during deletion', async () => {
      MockedCategory.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/categories/mockId123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });
});
