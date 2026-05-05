import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    clickedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Click", clickSchema);