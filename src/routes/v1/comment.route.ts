import express from "express";
import {
  createCommentController,
  deleteCommentController,
} from "../../controllers/comment.controller";
import { validateArticle } from "../../helpers/validArticle";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
router.post("/c/create", isAuthenticatedUser, createCommentController);
router.delete(
  "/c/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteCommentController
);

export default router;
