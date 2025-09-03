import mongoose from 'mongoose';
import { Client, IClient } from '../models/Client';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Client Model Tests', () => {
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

  // מחיקת הלקוחות שנוצרו בבדיקה הנוכחית בלבד
  afterEach(async () => {
    await Client.deleteMany({});
  });

  describe('Client Schema Validation', () => {
    it('should create a valid client with all fields', async () => {
      const clientData = {
        name: 'John Doe',
        phone: '123-456-7890',
        email: 'john@example.com',
        address: '123 Main St, City',
        companyId: '123456789',
        type: 'private' as const
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient._id).toBeDefined();
      expect(savedClient.name).toBe('John Doe');
      expect(savedClient.phone).toBe('123-456-7890');
      expect(savedClient.email).toBe('john@example.com');
      expect(savedClient.address).toBe('123 Main St, City');
      expect(savedClient.companyId).toBe('123456789');
      expect(savedClient.type).toBe('private');
    });

    it('should create a client with only name (required field)', async () => {
      const clientData = {
        name: 'Jane Doe'
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient._id).toBeDefined();
      expect(savedClient.name).toBe('Jane Doe');
      expect(savedClient.phone).toBeUndefined();
      expect(savedClient.email).toBeUndefined();
      expect(savedClient.address).toBeUndefined();
      expect(savedClient.companyId).toBeUndefined();
      expect(savedClient.type).toBeUndefined();
    });

    it('should create a business client', async () => {
      const clientData = {
        name: 'Acme Corporation',
        phone: '555-0123',
        email: 'info@acme.com',
        companyId: '987654321',
        type: 'business' as const
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient.name).toBe('Acme Corporation');
      expect(savedClient.type).toBe('business');
      expect(savedClient.companyId).toBe('987654321');
    });

    it('should fail to create a client without name', async () => {
      const clientData = {
        phone: '123-456-7890',
        email: 'test@example.com'
      };

      const client = new Client(clientData);
      
      await expect(client.save()).rejects.toThrow();
    });

    it('should validate client type enum', async () => {
      const clientData = {
        name: 'Test Client',
        type: 'invalid_type' as any
      };

      const client = new Client(clientData);
      
      await expect(client.save()).rejects.toThrow();
    });

    it('should allow valid client types', async () => {
      // בדיקת private
      const privateClient = new Client({
        name: 'Private Client',
        type: 'private'
      });
      const savedPrivate = await privateClient.save();
      expect(savedPrivate.type).toBe('private');

      // בדיקת business
      const businessClient = new Client({
        name: 'Business Client',
        type: 'business'
      });
      const savedBusiness = await businessClient.save();
      expect(savedBusiness.type).toBe('business');
    });
  });

  describe('Client Database Operations', () => {
    it('should find clients by name', async () => {
      await Client.create([
        { name: 'John Doe', type: 'private' },
        { name: 'Acme Corp', type: 'business' },
        { name: 'Jane Smith', type: 'private' }
      ]);

      const foundClient = await Client.findOne({ name: 'Acme Corp' });
      
      expect(foundClient).toBeTruthy();
      expect(foundClient?.name).toBe('Acme Corp');
      expect(foundClient?.type).toBe('business');
    });

    it('should find clients by type', async () => {
      await Client.create([
        { name: 'John Doe', type: 'private' },
        { name: 'Acme Corp', type: 'business' },
        { name: 'Jane Smith', type: 'private' },
        { name: 'Tech Inc', type: 'business' }
      ]);

      const businessClients = await Client.find({ type: 'business' });
      
      expect(businessClients).toHaveLength(2);
      expect(businessClients.map(c => c.name)).toContain('Acme Corp');
      expect(businessClients.map(c => c.name)).toContain('Tech Inc');
    });

    it('should update client information', async () => {
      const client = await Client.create({
        name: 'John Doe',
        phone: '123-456-7890',
        type: 'private'
      });

      const updatedClient = await Client.findByIdAndUpdate(
        client._id,
        { 
          phone: '999-888-7777',
          email: 'john.updated@example.com',
          type: 'business'
        },
        { new: true }
      );

      expect(updatedClient?.phone).toBe('999-888-7777');
      expect(updatedClient?.email).toBe('john.updated@example.com');
      expect(updatedClient?.type).toBe('business');
      expect(updatedClient?.name).toBe('John Doe'); // השם לא השתנה
    });

    it('should delete a client', async () => {
      const client = await Client.create({
        name: 'John Doe',
        email: 'john@example.com'
      });

      await Client.findByIdAndDelete(client._id);

      const deletedClient = await Client.findById(client._id);
      expect(deletedClient).toBeNull();
    });

    it('should get all clients', async () => {
      await Client.create([
        { name: 'John Doe', type: 'private' },
        { name: 'Acme Corp', type: 'business' },
        { name: 'Jane Smith', phone: '555-0123' }
      ]);

      const allClients = await Client.find({});
      
      expect(allClients).toHaveLength(3);
      
      const clientNames = allClients.map(client => client.name);
      expect(clientNames).toContain('John Doe');
      expect(clientNames).toContain('Acme Corp');
      expect(clientNames).toContain('Jane Smith');
    });

    it('should find clients by email', async () => {
      await Client.create([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
        { name: 'Bob Wilson', phone: '555-0123' }
      ]);

      const clientWithEmail = await Client.findOne({ email: 'jane@example.com' });
      
      expect(clientWithEmail).toBeTruthy();
      expect(clientWithEmail?.name).toBe('Jane Smith');
      expect(clientWithEmail?.email).toBe('jane@example.com');
    });

    it('should find clients by companyId', async () => {
      await Client.create([
        { name: 'Acme Corp', companyId: '123456789', type: 'business' },
        { name: 'Tech Inc', companyId: '987654321', type: 'business' },
        { name: 'John Doe', type: 'private' }
      ]);

      const clientWithCompanyId = await Client.findOne({ companyId: '987654321' });
      
      expect(clientWithCompanyId).toBeTruthy();
      expect(clientWithCompanyId?.name).toBe('Tech Inc');
      expect(clientWithCompanyId?.companyId).toBe('987654321');
      expect(clientWithCompanyId?.type).toBe('business');
    });
  });
});
