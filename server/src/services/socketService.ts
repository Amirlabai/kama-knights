import { Server, Socket } from 'socket.io';

export interface ActiveUser {
    userId: string;
    socketId: string;
    location: { lat: number; lng: number };
    networkType: 'wifi' | 'mobile'; // mobile = high priority
}

let activeUsers: Record<string, ActiveUser> = {};
let io: Server;

export const initSocket = (serverIo: Server) => {
    io = serverIo;
    io.on('connection', (socket: Socket) => {
        console.log('Socket connected:', socket.id);

        const authenticatedUser = socket.data.user;

        // User joins - use authenticated userId
        socket.on('join', (data: { location: { lat: number; lng: number }; networkType: 'wifi' | 'mobile' }) => {
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

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const getActiveUsers = () => Object.values(activeUsers);
