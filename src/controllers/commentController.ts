import { Request, Response } from "express";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import crypto from "crypto";
import { cloudinary } from "../config/index.js";
import { verifyEmail } from "../utils/emailVerifier.js";

interface EmailVerifyResult {
    format_valid: boolean;
    smtp_check: boolean;
}

export const getComments = async (req: Request, res: Response) => {
    try {
        const { page } = req.query;
        const filter = page && typeof page === "string" ? { page } : {};
        const comments = await Comment.find(filter).sort({ timestamp: -1 });
        const users = await User.find();

        const merged = comments.map(c => {
            const user = users.find(u => u.email === c.email);
            return {
                ...c.toObject(),
                name: user ? user.name : null,
                avatar: user ? user.avatar : null,
                avatarHash: user ? user.avatarHash : null
            };
        });
        res.json(merged);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const { name, email, text, page } = req.body;
        let user = await User.findOne({ email });

        // Email Verification Logic
        if (!user) {
            const result = (await verifyEmail(email).catch(() => null)) as EmailVerifyResult || null;
            if (!result || !result.format_valid || !result.smtp_check) {
                return res.status(400).json({ error: "Invalid email address." });
            }
        }

        let avatarPath: string = user?.avatar || "";
        let newHash: string | null = null;

        if (req.file) {
            const fileBuffer = req.file.buffer;
            newHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            if (user && user.avatarHash === newHash) {
                avatarPath = user.avatar;
            } else {
                avatarPath = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "user_avatars" },
                        (error, result) => {
                            if (error || !result) reject(error || new Error("Upload failed"));
                            else resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(fileBuffer);
                });
            }
        }

        if (user) {
            user.name = name;
            user.avatar = avatarPath;
            if (newHash) user.avatarHash = newHash;
            await user.save();
        } else {
            user = await User.create({ email, name, avatar: avatarPath, avatarHash: newHash });
        }

        const newComment = await Comment.create({ email, text, page });
        res.json({ ...newComment.toObject(), name: user.name, avatar: user.avatar });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const updated = await Comment.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.json(updated);
        const { text, email } = req.body;
        const comment = await Comment.findById(req.params.id);  
        if (!comment) return res.status(404).json({ error: "Not found" });
        if (comment.email !== email) {
            return res.status(403).json({ error: "Unauthorized: You do not own this comment." });
        }
        comment.text = text;
        await comment.save();
        res.json(comment);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { email } = req.query;
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: "Not found" });
        if (comment.email !== email) {
            return res.status(403).json({ error: "Unauthorized: You do not own this comment." });
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};