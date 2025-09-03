import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('User Model Tests', () => {
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
    await User.deleteMany({});
  });

  describe('User Schema Validation', () => {
    it('should create a valid user with all fields', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        businessType: 'זעיר' as const,
        email: 'test@example.com'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe('testuser');
      expect(savedUser.password).toBe('password123');
      expect(savedUser.businessType).toBe('זעיר');
      expect(savedUser.email).toBe('test@example.com');
    });

    it('should create a user without email', async () => {
      const userData = {
        username: 'testuser2',
        password: 'password123',
        businessType: 'פטור' as const
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe('testuser2');
      expect(savedUser.businessType).toBe('פטור');
      expect(savedUser.email).toBeUndefined();
    });

    it('should fail to create a user without username', async () => {
      const userData = {
        password: 'password123',
        businessType: 'זעיר' as const
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail to create a user without password', async () => {
      const userData = {
        username: 'testuser',
        businessType: 'זעיר' as const
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail to create a user without businessType', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique username constraint', async () => {
      // יצירת משתמש ראשון
      const user1 = new User({
        username: 'uniqueuser',
        password: 'password1',
        businessType: 'זעיר'
      });
      await user1.save();

      // ניסיון יצירת משתמש שני עם אותו שם משתמש
      const user2 = new User({
        username: 'uniqueuser',
        password: 'password2',
        businessType: 'פטור'
      });

      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate businessType enum - זעיר', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        businessType: 'זעיר' as const
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.businessType).toBe('זעיר');
    });

    it('should validate businessType enum - פטור', async () => {
      const userData = {
        username: 'testuser2',
        password: 'password123',
        businessType: 'פטור' as const
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.businessType).toBe('פטור');
    });

    it('should validate businessType enum - מורשה', async () => {
      const userData = {
        username: 'testuser3',
        password: 'password123',
        businessType: 'מורשה' as const
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.businessType).toBe('מורשה');
    });

    it('should fail with invalid businessType', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        businessType: 'invalid_type' as any
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('User Database Operations', () => {
    it('should find users by username', async () => {
      await User.create([
        { username: 'user1', password: 'pass1', businessType: 'זעיר' },
        { username: 'user2', password: 'pass2', businessType: 'פטור' },
        { username: 'user3', password: 'pass3', businessType: 'מורשה' }
      ]);

      const foundUser = await User.findOne({ username: 'user2' });
      
      expect(foundUser).toBeTruthy();
      expect(foundUser?.username).toBe('user2');
      expect(foundUser?.businessType).toBe('פטור');
    });

    it('should find users by businessType', async () => {
      await User.create([
        { username: 'user1', password: 'pass1', businessType: 'זעיר' },
        { username: 'user2', password: 'pass2', businessType: 'זעיר' },
        { username: 'user3', password: 'pass3', businessType: 'מורשה' }
      ]);

      const smallBusinessUsers = await User.find({ businessType: 'זעיר' });
      
      expect(smallBusinessUsers).toHaveLength(2);
      expect(smallBusinessUsers.map(u => u.username)).toContain('user1');
      expect(smallBusinessUsers.map(u => u.username)).toContain('user2');
    });

    it('should update user information', async () => {
      const user = await User.create({
        username: 'testuser',
        password: 'oldpassword',
        businessType: 'זעיר'
      });

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { 
          password: 'newpassword',
          businessType: 'מורשה',
          email: 'newemail@example.com'
        },
        { new: true }
      );

      expect(updatedUser?.password).toBe('newpassword');
      expect(updatedUser?.businessType).toBe('מורשה');
      expect(updatedUser?.email).toBe('newemail@example.com');
      expect(updatedUser?.username).toBe('testuser'); // השם לא השתנה
    });

    it('should delete a user', async () => {
      const user = await User.create({
        username: 'testuser',
        password: 'password123',
        businessType: 'זעיר'
      });

      await User.findByIdAndDelete(user._id);

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should get all users', async () => {
      await User.create([
        { username: 'user1', password: 'pass1', businessType: 'זעיר' },
        { username: 'user2', password: 'pass2', businessType: 'פטור' },
        { username: 'user3', password: 'pass3', businessType: 'מורשה' }
      ]);

      const allUsers = await User.find({});
      
      expect(allUsers).toHaveLength(3);
      
      const usernames = allUsers.map(user => user.username);
      expect(usernames).toContain('user1');
      expect(usernames).toContain('user2');
      expect(usernames).toContain('user3');
    });

    it('should find users by email', async () => {
      await User.create([
        { username: 'user1', password: 'pass1', businessType: 'זעיר', email: 'user1@test.com' },
        { username: 'user2', password: 'pass2', businessType: 'פטור', email: 'user2@test.com' },
        { username: 'user3', password: 'pass3', businessType: 'מורשה' }
      ]);

      const userWithEmail = await User.findOne({ email: 'user2@test.com' });
      
      expect(userWithEmail).toBeTruthy();
      expect(userWithEmail?.username).toBe('user2');
      expect(userWithEmail?.email).toBe('user2@test.com');
    });
  });
});
