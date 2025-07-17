import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/User';
import { User } from '../models/User';

jest.mock('../models/User');

describe('User Controller', () => {
  it('getAllUsers returns users', async () => {
    (User.find as jest.Mock).mockResolvedValue([{ name: 'גיל' }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllUsers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'גיל' }]);
  });

  it('getUserById returns user', async () => {
    (User.findById as jest.Mock).mockResolvedValue({ name: 'גיל' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await getUserById(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'גיל' });
  });

  it('createUser creates and returns user', async () => {
    (User as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ name: 'גיל' })
    }));
    const req = { body: { name: 'גיל' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('updateUser updates and returns user', async () => {
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'מן' });
    const req = { params: { id: '1' }, body: { name: 'מן' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await updateUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'מן' });
  });

  it('deleteUser deletes and returns message', async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'גיל' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await deleteUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
  });
});