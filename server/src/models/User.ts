import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    phoneNumber: string;
    isApproved: boolean;
    isAdmin: boolean;
    role: 'user' | 'admin';
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true, unique: true },
    isApproved: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }, // Additional flag for easy checking
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
