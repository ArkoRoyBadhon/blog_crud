import express from "express";
import {
  createCommentController,
  deleteCommentController,
} from "../../controllers/comment.controller";
const router = express.Router();

// employee personal Data
router.post("/c/create", createCommentController);
router.delete("/c/delete/:id", deleteCommentController);

export default router;
