"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_controller_1 = require("../../controllers/article.controller");
const validArticle_1 = require("../../helpers/validArticle");
const router = express_1.default.Router();
// employee personal Data
router.post("/a/create", validArticle_1.validateArticle, article_controller_1.createArticleController);
router.get("/a/get", article_controller_1.getAllArticleController);
router.get("/a/get/:id", article_controller_1.getArticleByIdController);
router.patch("/a/update/:id", article_controller_1.updateArticleByIdController);
router.delete("/a/delete/:id", article_controller_1.deleteArticleByIdController);
exports.default = router;
