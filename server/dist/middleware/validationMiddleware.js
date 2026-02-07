"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApproveUser = exports.validateAlert = exports.validateLogin = void 0;
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
});
const alertSchema = zod_1.z.object({
    location: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180)
    }),
    message: zod_1.z.string()
        .min(1, 'Message cannot be empty')
        .max(500, 'Message too long')
});
const approveUserSchema = zod_1.z.object({
    userId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
});
const validateLogin = (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.issues
            });
        }
        next(error);
    }
};
exports.validateLogin = validateLogin;
const validateAlert = (req, res, next) => {
    try {
        alertSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.issues
            });
        }
        next(error);
    }
};
exports.validateAlert = validateAlert;
const validateApproveUser = (req, res, next) => {
    try {
        approveUserSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.issues
            });
        }
        next(error);
    }
};
exports.validateApproveUser = validateApproveUser;
