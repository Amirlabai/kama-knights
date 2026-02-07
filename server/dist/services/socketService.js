"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsers = exports.getIO = exports.initSocket = void 0;
let activeUsers = {};
let io;
const initSocket = (serverIo) => {
    io = serverIo;
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        // User joins -> registers their ID and initial state
        socket.on('join', (data) => {
            activeUsers[socket.id] = Object.assign(Object.assign({}, data), { socketId: socket.id });
            console.log(`User ${data.userId} joined. Net: ${data.networkType}`);
        });
        // Pings location update
        socket.on('updateLocation', (data) => {
            if (activeUsers[socket.id]) {
                activeUsers[socket.id].location = data.location;
                activeUsers[socket.id].networkType = data.networkType;
            }
        });
        socket.on('disconnect', () => {
            delete activeUsers[socket.id];
        });
    });
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
const getActiveUsers = () => Object.values(activeUsers);
exports.getActiveUsers = getActiveUsers;
