import {
  incomeVsExpense,
  incomeAnalysis,
  expenseAnalysis
} from '../controllers/Report';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';

jest.mock('../models/Income');
jest.mock('../models/Expense');

describe('Report Controller', () => {
  it('incomeVsExpense returns totals', async () => {
    (Income.aggregate as jest.Mock).mockResolvedValueOnce([{ total: 100 }]);
    (Expense.aggregate as jest.Mock).mockResolvedValueOnce([{ total: 50 }]);
    const req = { query: {} } as any;
    const res = { json: jest.fn() } as any;
    await incomeVsExpense(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ totalIncome: 100, totalExpense: 50 });
  });

  it('incomeAnalysis returns array', async () => {
    (Income.aggregate as jest.Mock).mockResolvedValue([{ total: 100 }]);
    const req = { query: {} } as any;
    const res = { json: jest.fn() } as any;
    await incomeAnalysis(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([{ total: 100 }]);
  });

  it('expenseAnalysis returns array', async () => {
    (Expense.aggregate as jest.Mock).mockResolvedValue([{ total: 50 }]);
    const req = { query: {} } as any;
    const res = { json: jest.fn() } as any;
    await expenseAnalysis(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([{ total: 50 }]);
  });
});