import mongoose from 'mongoose';
import { Category, ICategory } from '../models/Category';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Category Model Tests', () => {
  let mongoServer: MongoMemoryServer;

  // הקמת MongoDB זמני לבדיקות
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // סגירת חיבור והשמדת MongoDB זמני
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  // מחיקת הקטגוריות שנוצרו בבדיקה הנוכחית בלבד
  afterEach(async () => {
    await Category.deleteMany({});
  });

  describe('Category Schema Validation', () => {
    it('should create a valid category', async () => {
      const categoryData = {
        name: 'Food',
        description: 'Food related expenses'
      };

      const category = new Category(categoryData);
      const savedCategory = await category.save();

      expect(savedCategory._id).toBeDefined();
      expect(savedCategory.name).toBe('Food');
      expect(savedCategory.description).toBe('Food related expenses');
    });

    it('should create a category without description', async () => {
      const categoryData = {
        name: 'Travel'
      };

      const category = new Category(categoryData);
      const savedCategory = await category.save();

      expect(savedCategory._id).toBeDefined();
      expect(savedCategory.name).toBe('Travel');
      expect(savedCategory.description).toBeUndefined();
    });

    it('should fail to create a category without name', async () => {
      const categoryData = {
        description: 'Category without name'
      };

      const category = new Category(categoryData);
      
      await expect(category.save()).rejects.toThrow();
    });

    it('should enforce unique name constraint', async () => {
      // יצירת קטגוריה ראשונה
      const category1 = new Category({
        name: 'Food',
        description: 'First food category'
      });
      await category1.save();

      // ניסיון יצירת קטגוריה שנייה עם אותו שם
      const category2 = new Category({
        name: 'Food',
        description: 'Second food category'
      });

      await expect(category2.save()).rejects.toThrow();
    });

    it('should allow categories with different names', async () => {
      const category1 = new Category({
        name: 'Food',
        description: 'Food expenses'
      });

      const category2 = new Category({
        name: 'Travel',
        description: 'Travel expenses'
      });

      const savedCategory1 = await category1.save();
      const savedCategory2 = await category2.save();

      expect(savedCategory1.name).toBe('Food');
      expect(savedCategory2.name).toBe('Travel');

      // וידוא שיש שתי קטגוריות במסד הנתונים
      const allCategories = await Category.find({});
      expect(allCategories).toHaveLength(2);
    });
  });

  describe('Category Database Operations', () => {
    it('should find categories by name', async () => {
      await Category.create([
        { name: 'Food', description: 'Food expenses' },
        { name: 'Travel', description: 'Travel expenses' },
        { name: 'Entertainment', description: 'Entertainment expenses' }
      ]);

      const foundCategory = await Category.findOne({ name: 'Travel' });
      
      expect(foundCategory).toBeTruthy();
      expect(foundCategory?.name).toBe('Travel');
      expect(foundCategory?.description).toBe('Travel expenses');
    });

    it('should update category information', async () => {
      const category = await Category.create({
        name: 'Food',
        description: 'Food expenses'
      });

      const updatedCategory = await Category.findByIdAndUpdate(
        category._id,
        { description: 'Updated food expenses' },
        { new: true }
      );

      expect(updatedCategory?.description).toBe('Updated food expenses');
      expect(updatedCategory?.name).toBe('Food'); // השם לא השתנה
    });

    it('should delete a category', async () => {
      const category = await Category.create({
        name: 'Food',
        description: 'Food expenses'
      });

      await Category.findByIdAndDelete(category._id);

      const deletedCategory = await Category.findById(category._id);
      expect(deletedCategory).toBeNull();
    });

    it('should get all categories', async () => {
      await Category.create([
        { name: 'Food', description: 'Food expenses' },
        { name: 'Travel', description: 'Travel expenses' },
        { name: 'Entertainment', description: 'Entertainment expenses' }
      ]);

      const allCategories = await Category.find({});
      
      expect(allCategories).toHaveLength(3);
      
      const categoryNames = allCategories.map(cat => cat.name);
      expect(categoryNames).toContain('Food');
      expect(categoryNames).toContain('Travel');
      expect(categoryNames).toContain('Entertainment');
    });
  });
});
