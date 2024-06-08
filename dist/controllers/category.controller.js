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
exports.updateCategoryController = exports.getCategoryByIdController = exports.getCategoriesController = exports.deleteCategoryController = exports.createCategoryController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const categories_1 = __importDefault(require("../models/categories"));
const article_1 = __importDefault(require("../models/article"));
exports.createCategoryController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const result = yield categories_1.default.create(data);
            return res.status(200).json({
                success: true,
                msg: "Category Created successfully.",
                result,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error creating Category data",
            error,
        });
    }
}));
exports.deleteCategoryController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            msg: "Category ID is required.",
        });
    }
    try {
        // const categoryOperation = await Category.findByIdAndDelete(categoryId);
        const categoryOperation = yield categories_1.default.findById(categoryId);
        console.log("delete", categoryOperation);
        if (!categoryOperation) {
            res.status(200).json({
                success: true,
                msg: "Category delete failed",
            });
        }
        const updateResult = yield article_1.default.updateMany({ categories: categoryId }, { $pull: { categories: categoryId } }).exec();
        // Return the articles found
        return res.status(200).json({
            success: true,
            msg: "delete successfully",
            updateResult,
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
exports.getCategoriesController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categories_1.default.find();
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category not found.",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Category fetched successfully.",
            category,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error fetching category",
            error,
        });
    }
}));
exports.getCategoryByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            msg: "Category ID is required.",
        });
    }
    try {
        const category = yield categories_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category not found.",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Category fetched successfully.",
            category,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error fetching category",
            error,
        });
    }
}));
exports.updateCategoryController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            msg: "Category ID is required.",
        });
    }
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
            const category = yield categories_1.default.findByIdAndUpdate(categoryId, data, {
                new: true,
                runValidators: true,
            });
            if (!category) {
                return res.status(404).json({
                    success: false,
                    msg: "Category not found.",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Category updated successfully.",
                category,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error updating category",
            error,
        });
    }
}));
