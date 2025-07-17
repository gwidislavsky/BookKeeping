import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/Expense';
import { Expense } from '../models/Expense';

jest.mock('../models/Expense');

describe('Expense Controller', () => {
  it('getAllExpenses returns expenses', async () => {
    (Expense.find as jest.Mock).mockResolvedValue([{ amount: 100 }]);
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await getAllExpenses(req, res);
    expect(res.json).toHaveBeenCalledWith([{ amount: 100 }]);
  });

  it('getExpenseById returns expense', async () => {
    (Expense.findById as jest.Mock).mockResolvedValue({ amount: 100 });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await getExpenseById(req, res);
    expect(res.json).toHaveBeenCalledWith({ amount: 100 });
  });

  it('createExpense creates and returns expense', async () => {
    (Expense as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ amount: 100 })
    }));
    const req = { body: { amount: 100 } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await createExpense(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('updateExpense updates and returns expense', async () => {
    (Expense.findByIdAndUpdate as jest.Mock).mockResolvedValue({ amount: 200 });
    const req = { params: { id: '1' }, body: { amount: 200 } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await updateExpense(req, res);
    expect(res.json).toHaveBeenCalledWith({ amount: 200 });
  });

  it('deleteExpense deletes and returns message', async () => {
    (Expense.findByIdAndDelete as jest.Mock).mockResolvedValue({ amount: 100 });
    const req = { params: { id: '1' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await deleteExpense(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Expense deleted' });
  });
});