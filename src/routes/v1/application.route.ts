import express from "express";
import {
  createApplicationController,
  getAllRequest,
  updateUserRoleController,
} from "../../controllers/application.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.get(
  "/a/get",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllRequest
);
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
