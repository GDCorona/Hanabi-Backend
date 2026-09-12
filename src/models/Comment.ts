import mongoose, { Document } from "mongoose";

export interface CommentInterface extends Document {
    email: string;
    text: string;
    page: string;
    timestamp: Date;
    isPinned: boolean;
}

const commentSchema = new mongoose.Schema<CommentInterface>({
    email: { type: String, required: true },
    text: { type: String, required: true },
    page: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isPinned: { type: Boolean, default: false }
});

export default mongoose.model<CommentInterface>("Comment", commentSchema);