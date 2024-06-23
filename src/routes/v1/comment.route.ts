import express from "express";
import {
  createCommentController,
  deleteCommentController,
} from "../../controllers/comment.controller";
import { validateArticle } from "../../helpers/validArticle";
import { authorizeRoles } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
router.post("/c/create", validateArticle, createCommentController);
router.delete("/c/delete/:id", validateArticle, authorizeRoles("admin"), deleteCommentController);

export default router;
