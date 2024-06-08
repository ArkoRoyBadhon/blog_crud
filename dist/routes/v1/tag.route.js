"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tag_controller_1 = require("../../controllers/tag.controller");
const router = express_1.default.Router();
// employee personal Data
router.post("/t/create", tag_controller_1.createTagController);
router.delete("/t/delete/:id", tag_controller_1.deleteTagController);
router.patch("/t/update/:id", tag_controller_1.updateTagController);
router.get("/t/get", tag_controller_1.getTagsController);
router.get("/t/get/:id", tag_controller_1.getTagByIdController);
exports.default = router;
