import express from "express";
import {
  createArticleController,
  deleteArticleByIdController,
  getAllArticleController,
  getArticleByIdController,
  updateArticleByIdController,
} from "../../controllers/article.controller";
import { validateArticle } from "../../helpers/validArticle";
const router = express.Router();

// employee personal Data
router.post("/a/create", validateArticle, createArticleController);
router.get("/a/get", getAllArticleController);
router.get("/a/get/:id", getArticleByIdController);
router.patch("/a/update/:id", updateArticleByIdController);
router.delete("/a/delete/:id", deleteArticleByIdController);

export default router;
