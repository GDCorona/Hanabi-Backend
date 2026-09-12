import mongoose, { Document } from "mongoose";

export interface VisitInterface extends Omit<Document, "_id"> {
    _id: string;
    count: number;
}

const VISIT_ID = "global-counter"; // fixed id
const visitSchema = new mongoose.Schema<VisitInterface>({
    _id: { type: String, default: VISIT_ID },
    count: { type: Number, default: 0 }
});

export default mongoose.model<VisitInterface>("Visit", visitSchema);