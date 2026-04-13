import mongoose from "mongoose";

const VISIT_ID = "global-counter"; // fixed id
const visitSchema = new mongoose.Schema({
  _id: { type: String, default: VISIT_ID },
  count: { type: Number, default: 0 }
});

export default mongoose.model("Visit", visitSchema);