"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsers = exports.getIO = exports.initSocket = void 0;
let activeUsers = {};
let io;
const initSocket = (serverIo) => {
    io = serverIo;
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        const authenticatedUser = socket.data.user;
        // User joins - use authenticated userId
        socket.on('join', (data) => {
            activeUsers[socket.id] = {
                userId: authenticatedUser._id.toString(), // From authenticated socket
                socketId: socket.id,
                location: data.location,
                networkType: data.networkType
            };
            console.log(`User ${authenticatedUser.phoneNumber} joined. Net: ${data.networkType}`);
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
