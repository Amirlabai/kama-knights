import express from 'express';
import { loginOrRegister, approveUser, getUsers } from '../controllers/authController';

const router = express.Router();

router.post('/login', loginOrRegister);
router.post('/approve', approveUser); // Needs middleware protectAdmin but keeping simple for now
router.get('/users', getUsers);       // Needs middleware protectAdmin

export default router;
