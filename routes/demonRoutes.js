import express from "express";
import { getDemons } from "../controllers/demonController.js";

const router = express.Router();
router.get("/", getDemons); // GET /api/demons

export default router;