"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../../controllers/comment.controller");
const router = express_1.default.Router();
// employee personal Data
router.post("/c/create", comment_controller_1.createCommentController);
router.delete("/c/delete/:id", comment_controller_1.deleteCommentController);
exports.default = router;
