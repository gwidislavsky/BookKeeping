import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/Category';
import { Category } from '../models/Category';

jest.mock('../models/Category');

describe('Category Controller', () => {
  it('getAllCategories returns categories', async () => {
    (Category.find as jest.Mock).mockResolvedValue([{ name: 'נקיון' }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllCategories(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'נקיון' }]);
  });

  it('getCategoryById returns category', async () => {
    (Category.findById as jest.Mock).mockResolvedValue({ name: 'נקיון' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await getCategoryById(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'נקיון' });
  });

  it('createCategory creates and returns category', async () => {
    (Category as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ name: 'נקיון' })
    }));
    const req = { body: { name: 'נקיון' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await createCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('updateCategory updates and returns category', async () => {
    (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'ריהוט' });
    const req = { params: { id: '1' }, body: { name: 'ריהוט' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await updateCategory(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'ריהוט' });
  });

  it('deleteCategory deletes and returns message', async () => {
    (Category.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'נקיון' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await deleteCategory(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Category deleted' });
  });
});