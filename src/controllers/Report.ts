import { Request, Response, NextFunction } from 'express';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';

// הכנסות מול הוצאות לפי טווח תאריכים
export const incomeVsExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from as string) : new Date('1970-01-01');
    const toDate = to ? new Date(to as string) : new Date();

    const incomes = await Income.aggregate([
      { $match: { date: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalIncome: incomes[0]?.total || 0,
      totalExpense: expenses[0]?.total || 0
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ניתוח הכנסות לפי לקוח, תאריך, סוג תשלום
export const incomeAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, client, paymentType } = req.query;
    const match: any = {};
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from as string);
      if (to) match.date.$lte = new Date(to as string);
    }
    if (client) match.client = client;
    if (paymentType) match.paymentType = paymentType;

    const result = await Income.aggregate([
      { $match: match },
      {
        $group: {
          _id: { client: '$client', paymentType: '$paymentType' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// הוצאות לפי קטגוריה, תאריך, סוג תשלום
export const expenseAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, category, paymentType } = req.query;
    const match: any = {};
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from as string);
      if (to) match.date.$lte = new Date(to as string);
    }
    if (category) match.category = category;
    if (paymentType) match.paymentType = paymentType;

    const result = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: { category: '$category', paymentType: '$paymentType' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};