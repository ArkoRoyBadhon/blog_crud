"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../../controllers/category.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/c/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), category_controller_1.createCategoryController);
router.delete("/c/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), category_controller_1.deleteCategoryController);
router.patch("/c/update/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), category_controller_1.updateCategoryController);
router.get("/c/get", category_controller_1.getCategoriesController);
router.get("/c/get/:id", category_controller_1.getCategoryByIdController);
exports.default = router;
