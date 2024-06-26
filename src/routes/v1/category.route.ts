import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "../../controllers/category.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post("/c/create", isAuthenticatedUser, authorizeRoles("admin"), createCategoryController);
router.delete("/c/delete/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteCategoryController);
router.patch("/c/update/:id",isAuthenticatedUser, authorizeRoles("admin"), updateCategoryController);
router.get("/c/get", getCategoriesController);
router.get("/c/get/:id", getCategoryByIdController);

export default router;
