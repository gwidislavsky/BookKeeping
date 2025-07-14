import { Request, Response } from 'express';
import {Expense} from '../models/Expense';

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().populate('supplier category user');
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('supplier category user');
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};