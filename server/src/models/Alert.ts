import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
    senderId: mongoose.Types.ObjectId;
    location: { type: 'Point'; coordinates: number[] }; // [lng, lat]
    message: string;
    recipients: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const AlertSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    message: { type: String, required: true },
    recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IAlert>('Alert', AlertSchema);
