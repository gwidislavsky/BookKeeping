import { getAllClients } from '../controllers/Client';
import { Client } from '../models/Client';

jest.mock('../models/Client');

describe('Client Controller', () => {
  it('getAllClients returns clients', async () => {
    (Client.find as jest.Mock).mockResolvedValue([{ name: 'לקוח' }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllClients(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'לקוח' }]);
  });
});