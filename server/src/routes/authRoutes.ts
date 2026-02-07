import express from 'express';
import { loginOrRegister, approveUser, getUsers } from '../controllers/authController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { validateLogin, validateApproveUser } from '../middleware/validationMiddleware';

const router = express.Router();

router.post('/login', validateLogin, loginOrRegister);
router.post('/approve', protect, adminOnly, validateApproveUser, approveUser);
router.get('/users', protect, adminOnly, getUsers);

export default router;
