import {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
} from '../controllers/Income';
import { Income } from '../models/Income';

jest.mock('../models/Income');

describe('Income Controller', () => {
  it('getAllIncomes returns incomes', async () => {
    (Income.find as jest.Mock).mockResolvedValue([{ amount: 100 }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllIncomes(req, res);
    expect(res.json).toHaveBeenCalledWith([{ amount: 100 }]);
  });

  it('getIncomeById returns income', async () => {
    (Income.findById as jest.Mock).mockResolvedValue({ amount: 100 });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await getIncomeById(req, res);
    expect(res.json).toHaveBeenCalledWith({ amount: 100 });
  });

  it('createIncome creates and returns income', async () => {
    (Income as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ amount: 100 })
    }));
    const req = { body: { amount: 100 } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await createIncome(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('updateIncome updates and returns income', async () => {
    (Income.findByIdAndUpdate as jest.Mock).mockResolvedValue({ amount: 200 });
    const req = { params: { id: '1' }, body: { amount: 200 } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await updateIncome(req, res);
    expect(res.json).toHaveBeenCalledWith({ amount: 200 });
  });

  it('deleteIncome deletes and returns message', async () => {
    (Income.findByIdAndDelete as jest.Mock).mockResolvedValue({ amount: 100 });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await deleteIncome(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Income deleted' });
  });
});