import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
    phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
});

const alertSchema = z.object({
    location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
    }),
    message: z.string()
        .min(1, 'Message cannot be empty')
        .max(500, 'Message too long')
});

const approveUserSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
});

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    try {
        loginSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.issues
            });
        }
        next(error);
    }
};

export const validateAlert = (req: Request, res: Response, next: NextFunction) => {
    try {
        alertSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.issues
            });
        }
        next(error);
    }
};

export const validateApproveUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        approveUserSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.issues
            });
        }
        next(error);
    }
};
