import express from "express";
import { getAllUsers, getUserByEmail, checkNameAvailability } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers); // GET /api/users
router.get("/check-name", checkNameAvailability); // GET /api/users/check-name
router.get("/:email", getUserByEmail); // GET /api/users/:email

export default router;