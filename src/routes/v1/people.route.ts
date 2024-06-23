import express from "express";
// import { CreatePeopleController, getAllPeople } from "../../controllers/auth.controller";
import {
  authSateController,
  forgotPassword,
  recoverPassword,
  registerUserController,
  resetPassword,
  signinController,
} from "../../controllers/auth.controller";
import { isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
// router.post("/a/create",validatePeople, CreatePeopleController);
router.get("/auth-state", isAuthenticatedUser, authSateController);
router.post("/register", registerUserController);
router.post("/login", signinController);
router.post("/reset-password", isAuthenticatedUser, resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/recover-password", recoverPassword);

// router.get("/all/get", getAllPeople);

export default router;
