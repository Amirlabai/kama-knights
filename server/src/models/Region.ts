import mongoose, { Document, Schema } from 'mongoose';

export interface IRegion extends Document {
    name: string;
    polygon: {
        type: 'Polygon';
        coordinates: number[][][]; // GeoJSON format: [[[lng, lat], ...]]
    };
    isActive: boolean;
}

const RegionSchema: Schema = new Schema({
    name: { type: String, required: true },
    polygon: {
        type: { type: String, enum: ['Polygon'], required: true },
        coordinates: { type: [[[Number]]], required: true },
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IRegion>('Region', RegionSchema);
