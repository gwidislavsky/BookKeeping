import mongoose from 'mongoose';
import { Supplier, ISupplier } from '../models/Supplier';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Supplier Model Tests', () => {
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
    await Supplier.deleteMany({});
  });

  describe('Supplier Schema Validation', () => {
    it('should create a valid supplier with all fields', async () => {
      const supplierData = {
        name: 'Office Supply Co',
        phone: '123-456-7890',
        email: 'contact@officesupply.com',
        address: '456 Business St, City',
        companyId: '987654321'
      };

      const supplier = new Supplier(supplierData);
      const savedSupplier = await supplier.save();

      expect(savedSupplier._id).toBeDefined();
      expect(savedSupplier.name).toBe('Office Supply Co');
      expect(savedSupplier.phone).toBe('123-456-7890');
      expect(savedSupplier.email).toBe('contact@officesupply.com');
      expect(savedSupplier.address).toBe('456 Business St, City');
      expect(savedSupplier.companyId).toBe('987654321');
    });

    it('should create a supplier with only name (required field)', async () => {
      const supplierData = {
        name: 'Simple Supplier'
      };

      const supplier = new Supplier(supplierData);
      const savedSupplier = await supplier.save();

      expect(savedSupplier._id).toBeDefined();
      expect(savedSupplier.name).toBe('Simple Supplier');
      expect(savedSupplier.phone).toBeUndefined();
      expect(savedSupplier.email).toBeUndefined();
      expect(savedSupplier.address).toBeUndefined();
      expect(savedSupplier.companyId).toBeUndefined();
    });

    it('should fail to create a supplier without name', async () => {
      const supplierData = {
        phone: '123-456-7890',
        email: 'test@example.com'
      };

      const supplier = new Supplier(supplierData);
      
      await expect(supplier.save()).rejects.toThrow();
    });
  });

  describe('Supplier Database Operations', () => {
    it('should find suppliers by name', async () => {
      await Supplier.create([
        { name: 'Office Supply Co', email: 'office@supply.com' },
        { name: 'Tech Supplier', phone: '555-0123' },
        { name: 'Paper Co', address: '123 Paper St' }
      ]);

      const foundSupplier = await Supplier.findOne({ name: 'Tech Supplier' });
      
      expect(foundSupplier).toBeTruthy();
      expect(foundSupplier?.name).toBe('Tech Supplier');
      expect(foundSupplier?.phone).toBe('555-0123');
    });

    it('should update supplier information', async () => {
      const supplier = await Supplier.create({
        name: 'Office Supply Co',
        phone: '123-456-7890',
        email: 'old@email.com'
      });

      const updatedSupplier = await Supplier.findByIdAndUpdate(
        supplier._id,
        { 
          phone: '999-888-7777',
          email: 'new@email.com',
          address: '789 New Address'
        },
        { new: true }
      );

      expect(updatedSupplier?.phone).toBe('999-888-7777');
      expect(updatedSupplier?.email).toBe('new@email.com');
      expect(updatedSupplier?.address).toBe('789 New Address');
      expect(updatedSupplier?.name).toBe('Office Supply Co'); // השם לא השתנה
    });

    it('should delete a supplier', async () => {
      const supplier = await Supplier.create({
        name: 'Office Supply Co',
        email: 'contact@office.com'
      });

      await Supplier.findByIdAndDelete(supplier._id);

      const deletedSupplier = await Supplier.findById(supplier._id);
      expect(deletedSupplier).toBeNull();
    });

    it('should get all suppliers', async () => {
      await Supplier.create([
        { name: 'Office Supply Co' },
        { name: 'Tech Supplier' },
        { name: 'Paper Co' }
      ]);

      const allSuppliers = await Supplier.find({});
      
      expect(allSuppliers).toHaveLength(3);
      
      const supplierNames = allSuppliers.map(supplier => supplier.name);
      expect(supplierNames).toContain('Office Supply Co');
      expect(supplierNames).toContain('Tech Supplier');
      expect(supplierNames).toContain('Paper Co');
    });

    it('should find suppliers by email', async () => {
      await Supplier.create([
        { name: 'Supplier A', email: 'a@supplier.com' },
        { name: 'Supplier B', email: 'b@supplier.com' },
        { name: 'Supplier C', phone: '555-0123' }
      ]);

      const supplierWithEmail = await Supplier.findOne({ email: 'b@supplier.com' });
      
      expect(supplierWithEmail).toBeTruthy();
      expect(supplierWithEmail?.name).toBe('Supplier B');
      expect(supplierWithEmail?.email).toBe('b@supplier.com');
    });

    it('should find suppliers by companyId', async () => {
      await Supplier.create([
        { name: 'Big Corp', companyId: '111111111' },
        { name: 'Small Co', companyId: '222222222' },
        { name: 'No ID Supplier' }
      ]);

      const supplierWithCompanyId = await Supplier.findOne({ companyId: '222222222' });
      
      expect(supplierWithCompanyId).toBeTruthy();
      expect(supplierWithCompanyId?.name).toBe('Small Co');
      expect(supplierWithCompanyId?.companyId).toBe('222222222');
    });
  });
});
