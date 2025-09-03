import express from 'express';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/Supplier';

const router = express.Router();

router.get('/', getAllSuppliers);
router.post('/',createSupplier);
router.get('/:id', (req, res) => {
  getSupplierById(req, res);
});
router.put('/:id', (req, res) => {
  updateSupplier(req, res);
});
router.delete('/:id', (req, res) => {
  deleteSupplier(req, res);
});

export default router;