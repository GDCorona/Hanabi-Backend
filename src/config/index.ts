import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        if (err instanceof Error) {
            console.error("❌ MongoDB Error:", err.message);
        } else {
            console.error("❌ MongoDB Error:", err);
        }
        process.exit(1);
    }
};

export const configureCloudinary = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("CRITICAL: Cloudinary environment variables are missing from .env!");
    }
    cloudinary.config({ 
        cloud_name: cloudName, 
        api_key: apiKey, 
        api_secret: apiSecret,
        secure: true
    });
};

export { cloudinary }; // Export cloudinary for use in routes/controllers

