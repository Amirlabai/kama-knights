import express from 'express';
import { sendAlert } from '../controllers/alertController';

const router = express.Router();

router.post('/send', sendAlert);

export default router;
