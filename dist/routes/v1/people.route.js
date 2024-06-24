"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { CreatePeopleController, getAllPeople } from "../../controllers/auth.controller";
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// employee personal Data
// router.post("/a/create",validatePeople, CreatePeopleController);
router.get("/auth-state", auth_1.isAuthenticatedUser, auth_controller_1.authSateController);
router.post("/register", auth_controller_1.registerUserController);
router.post("/login", auth_controller_1.signinController);
router.post("/reset-password", auth_1.isAuthenticatedUser, auth_controller_1.resetPassword);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/recover-password", auth_controller_1.recoverPassword);
// router.get("/all/get", getAllPeople);
exports.default = router;
