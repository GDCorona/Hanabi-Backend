import mongoose, { Document } from "mongoose";

export interface ClickInterface extends Document {
    ipAddress: string;
    clickedAt: Date;
}

const clickSchema = new mongoose.Schema<ClickInterface>({
    ipAddress: { type: String, required: true, unique: true },
    clickedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ClickInterface>("Click", clickSchema);