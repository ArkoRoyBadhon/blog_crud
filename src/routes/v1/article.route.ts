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
import { authorizeRoles } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
// router.post("/a/create", validateArticle, authorizeRoles("author"), createArticleController);
router.post("/a/create", createArticleController);
router.get("/a/get", getAllArticleController);
router.get("/a/g/recent", getRecentBlogs);
router.get("/a/get/:id", getArticleByIdController);
router.patch(
  "/a/update/:id",
  validateArticle,
  authorizeRoles("author", "admin"),
  updateArticleByIdController
);
router.delete(
  "/a/delete/:id",
  validateArticle,
  authorizeRoles("author", "admin"),
  deleteArticleByIdController
);

export default router;
