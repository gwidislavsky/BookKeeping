import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/Supplier';
import { Supplier } from '../models/Supplier';

jest.mock('../models/Supplier');

describe('Supplier Controller', () => {
  it('getAllSuppliers returns suppliers', async () => {
    (Supplier.find as jest.Mock).mockResolvedValue([{ name: 'נתן' }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllSuppliers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'נתן' }]);
  });

  it('getSupplierById returns supplier', async () => {
    (Supplier.findById as jest.Mock).mockResolvedValue({ name: 'נתן' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await getSupplierById(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'נתן' });
  });

  it('createSupplier creates and returns supplier', async () => {
    (Supplier as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ name: 'נתן' })
    }));
    const req = { body: { name: 'נתן' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await createSupplier(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('updateSupplier updates and returns supplier', async () => {
    (Supplier.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'לוי' });
    const req = { params: { id: '1' }, body: { name: 'לוי' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await updateSupplier(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'לוי' });
  });

  it('deleteSupplier deletes and returns message', async () => {
    (Supplier.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'נתן' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await deleteSupplier(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Supplier deleted' });
  });
});