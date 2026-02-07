"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlert = void 0;
const Alert_1 = __importDefault(require("../models/Alert"));
const Region_1 = __importDefault(require("../models/Region"));
const User_1 = __importDefault(require("../models/User"));
const socketService_1 = require("../services/socketService");
const geofenceService_1 = require("../services/geofenceService");
const sendAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, location, message } = req.body;
    // location: { lat, lng }
    try {
        // 1. Validate Sender
        const sender = yield User_1.default.findById(senderId);
        if (!sender || !sender.isApproved) {
            return res.status(403).json({ message: 'Unauthorized sender' });
        }
        // 2. Get Active Region (Assuming single active region for now, or find region containing point)
        const region = yield Region_1.default.findOne({ isActive: true });
        if (!region) {
            return res.status(404).json({ message: 'No active region found' });
        }
        // 3. Filter Active Users in Region
        const activeSocketUsers = (0, socketService_1.getActiveUsers)(); // [{ userId, socketId, location, networkType }]
        // Logic: 
        // - Must be in region
        // - Sort by Priority: Mobile > Wifi
        const recipients = [];
        const targetedSockets = [];
        for (const user of activeSocketUsers) {
            // Skip sender if they are in the list (optional, maybe they want to see it too?)
            if (user.userId === senderId)
                continue;
            if ((0, geofenceService_1.isPointInRegion)(user.location, region)) {
                recipients.push(user);
            }
        }
        // Sort: Mobile first
        recipients.sort((a, b) => {
            if (a.networkType === 'mobile' && b.networkType !== 'mobile')
                return -1;
            if (a.networkType !== 'mobile' && b.networkType === 'mobile')
                return 1;
            return 0;
        });
        // 4. Dispatch Alert via Socket
        const io = (0, socketService_1.getIO)();
        recipients.forEach((user) => {
            io.to(user.socketId).emit('alert', {
                message,
                location, // Target location
                sentAt: new Date(),
                senderPhone: sender.phoneNumber
            });
            targetedSockets.push(user.socketId);
        });
        // 5. Save Alert to DB
        const newAlert = yield Alert_1.default.create({
            senderId,
            location: { type: 'Point', coordinates: [location.lng, location.lat] },
            message,
            recipients: recipients.map(r => r.userId)
        });
        res.status(200).json({
            message: 'Alert sent successfully',
            recipientCount: recipients.length,
            alertId: newAlert._id
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.sendAlert = sendAlert;
