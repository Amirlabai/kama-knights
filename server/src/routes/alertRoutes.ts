import express from 'express';
import { sendAlert } from '../controllers/alertController';
import { protect } from '../middleware/authMiddleware';
import { validateAlert } from '../middleware/validationMiddleware';

const router = express.Router();

router.post('/send', protect, validateAlert, sendAlert);

export default router;
