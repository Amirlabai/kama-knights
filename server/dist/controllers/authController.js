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
exports.getUsers = exports.approveUser = exports.loginOrRegister = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '365d' }); // Long expiry for persistent login
};
// Register or Login (One step for phone number)
const loginOrRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
    try {
        // Find user by comparing hashed phone numbers
        const allUsers = yield User_1.default.find();
        let user = null;
        for (const u of allUsers) {
            if (yield u.comparePhoneNumber(phoneNumber)) {
                user = u;
                break;
            }
        }
        if (!user) {
            // Create new user with hashed phone number
            const hashedPhone = yield User_1.default.hashPhoneNumber(phoneNumber);
            user = yield User_1.default.create({ phoneNumber: hashedPhone });
            return res.status(201).json({
                message: 'Registration successful. Waiting for admin approval.',
                status: 'pending',
                user: { _id: user._id, isApproved: user.isApproved }
            });
        }
        if (!user.isApproved) {
            return res.status(403).json({
                message: 'Account not approved yet.',
                status: 'pending',
                user: { _id: user._id, isApproved: user.isApproved }
            });
        }
        // User is approved, return token
        const token = generateToken(user._id);
        return res.status(200).json({
            message: 'Login successful',
            status: 'active',
            token,
            user: {
                _id: user._id,
                isApproved: user.isApproved,
                role: user.role
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.loginOrRegister = loginOrRegister;
// Admin: Approve User
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body; // Target user ID
    try {
        const user = yield User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        user.isApproved = true;
        yield user.save();
        res.json({ message: 'User approved', user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.approveUser = approveUser;
// Admin: Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().sort({ createdAt: -1 }).select('-phoneNumber');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getUsers = getUsers;
