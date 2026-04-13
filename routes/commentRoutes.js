import express from "express";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/commentController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getComments);               // GET /api/comments
router.post("/", upload.single("avatar"), createComment); // POST /api/comments
router.put("/:id", updateComment);          // PUT /api/comments/:id
router.delete("/:id", deleteComment);       // DELETE /api/comments/:id

export default router;