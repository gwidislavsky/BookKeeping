import { Request, Response } from 'express';
import { Income } from '../models/Income';

export const getAllIncomes = async (req: Request, res: Response): Promise<void> => {
  try {
    const incomes = await Income.find().populate('client user');
    res.json(incomes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getIncomeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const income = await Income.findById(req.params.id).populate('client user');
    if (!income) {
      res.status(404).json({ error: 'Income not found' });
      return;
    }
    res.json(income);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!income) {
      res.status(404).json({ error: 'Income not found' });
      return;
    }
    res.json(income);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      res.status(404).json({ error: 'Income not found' });
      return;
    }
    res.json({ message: 'Income deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};