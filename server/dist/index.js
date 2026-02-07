"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all for now, lock down for prod
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3001;
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const alertRoutes_1 = __importDefault(require("./routes/alertRoutes"));
const socketService_1 = require("./services/socketService");
app.use('/api/auth', authRoutes_1.default);
app.use('/api/alerts', alertRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Personal Notifier API is running');
});
// Initialize Socket Service
(0, socketService_1.initSocket)(io);
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
