"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../../controllers/comment.controller");
const validArticle_1 = require("../../helpers/validArticle");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// employee personal Data
router.post("/c/create", validArticle_1.validateArticle, comment_controller_1.createCommentController);
router.delete("/c/delete/:id", validArticle_1.validateArticle, (0, auth_1.authorizeRoles)("admin"), comment_controller_1.deleteCommentController);
exports.default = router;
