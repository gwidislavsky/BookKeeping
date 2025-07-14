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
router.post('/', createIncome);
router.get('/:id', (req, res) => {
  getIncomeById(req, res);
});
router.put('/:id', (req, res) => {
  updateIncome(req, res);
});
router.delete('/:id', (req, res) => {
  deleteIncome(req, res);
});

export default router;