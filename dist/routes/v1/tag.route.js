"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tag_controller_1 = require("../../controllers/tag.controller");
const validArticle_1 = require("../../helpers/validArticle");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// employee personal Data
router.post("/t/create", validArticle_1.validateArticle, (0, auth_1.authorizeRoles)("author"), tag_controller_1.createTagController);
router.delete("/t/delete/:id", validArticle_1.validateArticle, (0, auth_1.authorizeRoles)("author"), tag_controller_1.deleteTagController);
router.patch("/t/update/:id", validArticle_1.validateArticle, (0, auth_1.authorizeRoles)("author"), tag_controller_1.updateTagController);
router.get("/t/get", tag_controller_1.getTagsController);
router.get("/t/get/:id", tag_controller_1.getTagByIdController);
exports.default = router;
