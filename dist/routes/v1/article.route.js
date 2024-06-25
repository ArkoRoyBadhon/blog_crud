"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_controller_1 = require("../../controllers/article.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// employee personal Data
router.post("/a/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("author", "admin"), article_controller_1.createArticleController);
router.get("/a/get", article_controller_1.getAllArticleController);
router.get("/a/g/recent", article_controller_1.getRecentBlogs);
router.get("/a/get/:id", article_controller_1.getArticleByIdController);
router.get("/a/getByuser", auth_1.isAuthenticatedUser, article_controller_1.getArticleByUserIdController);
router.patch("/a/update/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("author", "admin"), article_controller_1.updateArticleByIdController);
router.delete("/a/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("author", "admin"), article_controller_1.deleteArticleByIdController);
exports.default = router;
