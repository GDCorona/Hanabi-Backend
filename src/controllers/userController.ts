import { Request, Response } from "express";
import User from "../models/User.js";

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find();
    res.json(users);
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const checkNameAvailability = async (req: Request, res: Response) => {
  try {
      const { name, email } = req.query;
      if (typeof name !== "string" || typeof email !== "string") {
          return res.status(400).json({ error: "Invalid query parameters" });
      }
      const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
      if (user && user.email !== email) {
          return res.json({ taken: true });
      }
      res.json({ taken: false });
  } catch (err) {
      res.status(500).json({ error: "Search failed" });
  }
};