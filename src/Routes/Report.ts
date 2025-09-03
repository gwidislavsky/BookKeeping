import express from 'express';
import {
  incomeVsExpense,
  incomeAnalysis,
  expenseAnalysis
} from '../controllers/Report';

const router = express.Router();

router.get('/income-vs-expense', incomeVsExpense);
router.get('/income-analysis', incomeAnalysis);
router.get('/expense-analysis', expenseAnalysis);

export default router;