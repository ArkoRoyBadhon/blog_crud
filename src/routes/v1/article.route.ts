import express from "express";
import {
  createArticleController,
  deleteArticleByIdController,
  getAllArticleController,
  getArticleByIdController,
  getRecentBlogs,
  // getRecentBlogs,
  updateArticleByIdController,
} from "../../controllers/article.controller";
import { validateArticle } from "../../helpers/validArticle";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
router.post("/a/create", isAuthenticatedUser, authorizeRoles("author","admin"), createArticleController);
router.get("/a/get", getAllArticleController);
router.get("/a/g/recent", getRecentBlogs);
router.get("/a/get/:id", getArticleByIdController);
router.patch("/a/update/:id",  isAuthenticatedUser, authorizeRoles("author", "admin"), updateArticleByIdController);
router.delete("/a/delete/:id",  isAuthenticatedUser, authorizeRoles("author", "admin"), deleteArticleByIdController);

export default router;
