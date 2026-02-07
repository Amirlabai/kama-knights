import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '365d' }); // Long expiry for persistent login
};

// Register or Login (One step for phone number)
export const loginOrRegister = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            // Create new user (Pending approval)
            user = await User.create({ phoneNumber });
            return res.status(201).json({
                message: 'Registration successful. Waiting for admin approval.',
                status: 'pending',
                user: { phoneNumber: user.phoneNumber, isApproved: user.isApproved }
            });
        }

        if (!user.isApproved) {
            return res.status(403).json({
                message: 'Account not approved yet.',
                status: 'pending',
                user: { phoneNumber: user.phoneNumber, isApproved: user.isApproved }
            });
        }

        // Use is approved, return token
        const token = generateToken(user._id);
        return res.status(200).json({
            message: 'Login successful',
            status: 'active',
            token,
            user: {
                _id: user._id,
                phoneNumber: user.phoneNumber,
                isApproved: user.isApproved,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Admin: Approve User
export const approveUser = async (req: Request, res: Response) => {
    const { userId } = req.body; // Target user ID

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isApproved = true;
        await user.save();

        res.json({ message: 'User approved', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Admin: Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
