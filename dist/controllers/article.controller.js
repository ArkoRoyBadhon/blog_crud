"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleByIdController = exports.updateArticleByIdController = exports.getArticleByIdController = exports.getRecentBlogs = exports.getAllArticleController = exports.createArticleController = void 0;
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const article_1 = __importDefault(require("../models/article"));
const categories_1 = __importDefault(require("../models/categories"));
const tags_1 = __importDefault(require("../models/tags"));
exports.createArticleController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map((error) => error.msg)[0];
            return res.status(422).json({
                errors: firstError,
            });
        }
        else {
            const data = req.body;
            const result = yield article_1.default.create(data);
            // console.log("dta", result);
            if (!result) {
                return res.status(422).json({
                    message: "Not Valid",
                });
            }
            if (result) {
                (_a = data === null || data === void 0 ? void 0 : data.tags) === null || _a === void 0 ? void 0 : _a.map((tagId) => __awaiter(void 0, void 0, void 0, function* () {
                    yield tags_1.default.findByIdAndUpdate(tagId, {
                        $push: { articles: result._id },
                    });
                }));
                (_b = data === null || data === void 0 ? void 0 : data.categories) === null || _b === void 0 ? void 0 : _b.map((categoryId) => __awaiter(void 0, void 0, void 0, function* () {
                    yield categories_1.default.findByIdAndUpdate(categoryId, {
                        $push: { categories: result._id },
                    });
                }));
            }
            return res.status(200).json({
                success: true,
                msg: "Article created successfully.",
                result,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error creating article",
            error,
        });
    }
}));
exports.getAllArticleController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tags, categories, author, dateFrom, dateTo, searchText, mostVisited, } = req.query;
        let filter = {};
        if (tags) {
            filter.tags = {
                $in: Array.isArray(tags) ? tags : tags.split(","),
            };
        }
        if (categories) {
            filter.categories = {
                $in: Array.isArray(categories)
                    ? categories
                    : categories.split(","),
            };
        }
        if (author) {
            filter.author = author;
        }
        if (dateFrom || dateTo) {
            filter.date = {};
            if (dateFrom) {
                filter.date.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.date.$lte = new Date(dateTo);
            }
        }
        if (searchText) {
            filter.$or = [
                { title: { $regex: searchText, $options: "i" } },
                { text: { $regex: searchText, $options: "i" } },
            ];
        }
        let query = article_1.default.find(filter)
            .populate("tags")
            .populate("categories")
            .populate("comments")
            .populate("author", "-password");
        if (mostVisited) {
            query = query.sort({ visit: -1 }).limit(5);
        }
        const result = yield query;
        return res.status(200).json({
            success: true,
            msg: "Articles fetched successfully.",
            result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error fetching articles",
            error,
        });
    }
}));
exports.getRecentBlogs = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags, categories, limit } = req.query;
    const limitNumber = Number(limit || "0");
    let filter = {};
    if (tags) {
        filter.tags = {
            $in: Array.isArray(tags) ? tags : tags.split(","),
        };
    }
    if (categories) {
        filter.categories = {
            $in: Array.isArray(categories)
                ? categories
                : categories.split(","),
        };
    }
    const result = yield article_1.default.find(filter)
        .sort({ createdAt: -1 })
        .limit(limitNumber || 5);
    res.status(200).json({
        success: true,
        msg: "Recent 5 Article fetched successfully.",
        result,
    });
}));
exports.getArticleByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield article_1.default.findById(id)
            .populate("tags")
            .populate("categories")
            .populate("comments")
            .populate("author", "-password");
        yield article_1.default.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result._id, { $inc: { visit: 1 } });
        return res.status(200).json({
            success: true,
            msg: "Article fetched successfully.",
            result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error Fetching article",
            error,
        });
    }
}));
exports.updateArticleByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = yield article_1.default.findByIdAndUpdate(id, data, {
            new: true,
            upsert: true,
        });
        // .populate("tags")
        // .populate("categories")
        // .populate("comments")
        // .populate("author");
        return res.status(200).json({
            success: true,
            msg: "Article updated successfully.",
            result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error updating article",
            error,
        });
    }
}));
exports.deleteArticleByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield article_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            msg: "Article deleted successfully.",
            result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error Deleting article",
            error,
        });
    }
}));
