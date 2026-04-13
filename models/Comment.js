import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  text: { type: String, required: true },
  page: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);