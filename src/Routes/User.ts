import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/User';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', (req, res) => {
  getUserById(req, res);
});
router.put('/:id', (req, res) => {
  updateUser(req, res);
});
router.delete('/:id', (req, res) => {
  deleteUser(req, res);
});

export default router;