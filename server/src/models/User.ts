import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    phoneNumber: string;
    isApproved: boolean;
    isAdmin: boolean;
    role: 'user' | 'admin';
    createdAt: Date;
    comparePhoneNumber(candidatePhone: string): Promise<boolean>;
}

interface IUserModel extends mongoose.Model<IUser> {
    hashPhoneNumber(phoneNumber: string): Promise<string>;
}

const UserSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true, unique: true },
    isApproved: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }, // Additional flag for easy checking
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

// Static method to hash phone number
UserSchema.statics.hashPhoneNumber = async function (phoneNumber: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(phoneNumber, salt);
};

// Instance method to compare phone number
UserSchema.methods.comparePhoneNumber = async function (candidatePhone: string): Promise<boolean> {
    return bcrypt.compare(candidatePhone, this.phoneNumber);
};

export default mongoose.model<IUser, IUserModel>('User', UserSchema);
