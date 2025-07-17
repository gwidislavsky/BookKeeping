import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/Client';
import { Client } from '../models/Client';

jest.mock('../models/Client');

describe('Client Controller', () => {
  it('getAllClients returns clients', async () => {
    (Client.find as jest.Mock).mockResolvedValue([{ name: 'דן' }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllClients(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'דן' }]);
  });

  it('getClientById returns client', async () => {
    (Client.findById as jest.Mock).mockResolvedValue({ name: 'דן' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await getClientById(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'דן' });
  });

  it('createClient creates and returns client', async () => {
    (Client as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ name: 'דן' })
    }));
    const req = { body: { name: 'דן' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await createClient(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('updateClient updates and returns client', async () => {
    (Client.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'דן' });
    const req = { params: { id: '1' }, body: { name: 'דן' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await updateClient(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'דן' });
  });

  it('deleteClient deletes and returns message', async () => {
    (Client.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'דן' });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await deleteClient(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Client deleted' });
  });
});