import express from "express";
import { getVisits, incrementVisits } from "../controllers/visitController.js";

const router = express.Router();

router.get("/", getVisits); // GET /api/visits
router.post("/", incrementVisits); // POST /api/visits

export default router;