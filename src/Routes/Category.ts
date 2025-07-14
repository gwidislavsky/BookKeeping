import express, { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/Category';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.get('/:id', (req, res) => {
  getCategoryById(req, res);
});
router.put('/:id', (req, res) => {
  updateCategory(req, res);
});
router.delete('/:id', (req, res) => {
  deleteCategory(req, res);
});

export default router;