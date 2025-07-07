import express from 'express';
import {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
} from '../controllers/Income';

const router = express.Router();

router.get('/', getAllIncomes);
router.get('/:id', getIncomeById);
router.post('/', createIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;