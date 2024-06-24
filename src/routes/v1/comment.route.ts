import express from "express";
import {
  createCommentController,
  deleteCommentController,
} from "../../controllers/comment.controller";
import { authorizeRoles } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
router.post("/c/create", createCommentController);
router.delete(
  "/c/delete/:id",
  authorizeRoles("admin"),
  deleteCommentController
);

export default router;
