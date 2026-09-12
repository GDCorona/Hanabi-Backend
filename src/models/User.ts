import mongoose, { Document } from "mongoose";

export interface UserInterface extends Document {
    email: string;
    name: string;
    page: string;
    avatar: string;
    avatarHash: string;
}

const userSchema = new mongoose.Schema<UserInterface>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "/uploads/defaultAvt.png" },
    avatarHash: { type: String }
});

export default mongoose.model<UserInterface>("User", userSchema);