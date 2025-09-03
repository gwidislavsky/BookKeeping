import express from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/Client';

const router = express.Router();

router.get('/', getAllClients);
router.post('/', createClient);
router.get('/:id', (req, res) => {
  getClientById(req, res);
});
router.put('/:id', (req, res) => {
  updateClient(req, res);
});
router.delete('/:id', (req, res) => {
  deleteClient(req, res);
});

export default router;