import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "../../controllers/category.controller";
const router = express.Router();

router.post("/c/create", createCategoryController);
router.delete("/c/delete/:id", deleteCategoryController);
router.patch("/c/update/:id", updateCategoryController);
router.get("/c/get", getCategoriesController);
router.get("/c/get/:id", getCategoryByIdController);

export default router;
