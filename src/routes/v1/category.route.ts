import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "../../controllers/category.controller";
import { validateArticle } from "../../helpers/validArticle";
import { authorizeRoles } from "../../middlewares/auth";
const router = express.Router();

router.post("/c/create", validateArticle, authorizeRoles("admin"), createCategoryController);
// router.post("/c/create", createCategoryController);
router.delete("/c/delete/:id", validateArticle, authorizeRoles("admin"), deleteCategoryController);
router.patch("/c/update/:id", validateArticle, authorizeRoles("admin"), updateCategoryController);
router.get("/c/get", getCategoriesController);
router.get("/c/get/:id", getCategoryByIdController);

export default router;
