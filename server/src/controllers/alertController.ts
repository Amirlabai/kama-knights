import { Request, Response } from 'express';
import Alert from '../models/Alert';
import Region from '../models/Region';
import User from '../models/User';
import { getActiveUsers, getIO } from '../services/socketService';
import { isPointInRegion } from '../services/geofenceService';

export const sendAlert = async (req: Request, res: Response) => {
    const { senderId, location, message } = req.body;
    // location: { lat, lng }

    try {
        // 1. Validate Sender
        const sender = await User.findById(senderId);
        if (!sender || !sender.isApproved) {
            return res.status(403).json({ message: 'Unauthorized sender' });
        }

        // 2. Get Active Region (Assuming single active region for now, or find region containing point)
        const region = await Region.findOne({ isActive: true });
        if (!region) {
            return res.status(404).json({ message: 'No active region found' });
        }

        // 3. Filter Active Users in Region
        const activeSocketUsers = getActiveUsers(); // [{ userId, socketId, location, networkType }]

        // Logic: 
        // - Must be in region
        // - Sort by Priority: Mobile > Wifi

        const recipients = [];
        const targetedSockets = [];

        for (const user of activeSocketUsers) {
            // Skip sender if they are in the list (optional, maybe they want to see it too?)
            if (user.userId === senderId) continue;

            if (isPointInRegion(user.location, region)) {
                recipients.push(user);
            }
        }

        // Sort: Mobile first
        recipients.sort((a, b) => {
            if (a.networkType === 'mobile' && b.networkType !== 'mobile') return -1;
            if (a.networkType !== 'mobile' && b.networkType === 'mobile') return 1;
            return 0;
        });

        // 4. Dispatch Alert via Socket
        const io = getIO();
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
        const newAlert = await Alert.create({
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

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
