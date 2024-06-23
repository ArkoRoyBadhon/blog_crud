"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const people_route_1 = __importDefault(require("./people.route"));
const article_route_1 = __importDefault(require("./article.route"));
const tag_route_1 = __importDefault(require("./tag.route"));
const category_route_1 = __importDefault(require("./category.route"));
const comment_route_1 = __importDefault(require("./comment.route"));
router.use("/author", people_route_1.default);
router.use("/article", article_route_1.default);
router.use("/tag", tag_route_1.default);
router.use("/category", category_route_1.default);
router.use("/comment", comment_route_1.default);
exports.default = router;