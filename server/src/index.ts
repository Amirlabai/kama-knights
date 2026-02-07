import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for now, lock down for prod
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
import authRoutes from './routes/authRoutes';
import alertRoutes from './routes/alertRoutes';
import { initSocket } from './services/socketService';

app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/', (req, res) => {
    res.send('Personal Notifier API is running');
});

// Initialize Socket Service
initSocket(io);

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
