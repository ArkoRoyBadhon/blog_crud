import express from "express";
import { validateArticle } from "../../helpers/validArticle";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import {
  createApplicationController,
  updateUserRoleController,
} from "../../controllers/application.controller";
const router = express.Router();

// employee personal Data
router.post(
  "/a/create",
  isAuthenticatedUser,
  authorizeRoles("regular"),
  createApplicationController
);
router.post(
  "/a/update",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUserRoleController
);

export default router;
