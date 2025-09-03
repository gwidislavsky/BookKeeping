import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/Expense';

const router = express.Router();

router.get('/', getAllExpenses);
router.post('/', createExpense);
router.get('/:id', (req, res) => {
  getExpenseById(req, res);
});
router.put('/:id', (req, res) => {
  updateExpense(req, res);
});
router.delete('/:id', (req, res) => {
  deleteExpense(req, res);
});

export default router;