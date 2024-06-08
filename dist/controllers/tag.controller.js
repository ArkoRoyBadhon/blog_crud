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
exports.updateTagController = exports.getTagByIdController = exports.getTagsController = exports.deleteTagController = exports.createTagController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const tags_1 = __importDefault(require("../models/tags"));
const article_1 = __importDefault(require("../models/article"));
exports.createTagController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const result = yield tags_1.default.create(data);
            return res.status(200).json({
                success: true,
                msg: "Tag Created successfully.",
                result
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error creating tag data",
            error,
        });
    }
}));
exports.deleteTagController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const TagId = req.params.id;
    if (!TagId) {
        return res.status(400).json({
            success: false,
            msg: "Tag ID is required.",
        });
    }
    try {
        const TagOperation = yield tags_1.default.findByIdAndDelete(TagId);
        // const TagOperation = await Tag.findById(TagId);
        console.log("delete", TagOperation);
        if (!TagOperation) {
            res.status(200).json({
                success: true,
                msg: "Tag delete failed",
            });
        }
        const updateResult = yield article_1.default.updateMany({ tags: TagId }, { $pull: { tags: TagId } }).exec();
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
exports.getTagsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield tags_1.default.find();
        if (!tag) {
            return res.status(404).json({
                success: false,
                msg: "Tag not found.",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Tag fetched successfully.",
            tag,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error fetching tag",
            error,
        });
    }
}));
exports.getTagByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = req.params.id;
    if (!tagId) {
        return res.status(400).json({
            success: false,
            msg: "Tag ID is required.",
        });
    }
    try {
        const tag = yield tags_1.default.findById(tagId);
        if (!tag) {
            return res.status(404).json({
                success: false,
                msg: "Tag not found.",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Tag fetched successfully.",
            tag,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error fetching tag",
            error,
        });
    }
}));
exports.updateTagController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = req.params.id;
    if (!tagId) {
        return res.status(400).json({
            success: false,
            msg: "Tag ID is required.",
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
            const tag = yield tags_1.default.findByIdAndUpdate(tagId, data, {
                new: true,
                runValidators: true,
            });
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    msg: "Tag not found.",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Tag updated successfully.",
                tag,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error updating tag",
            error,
        });
    }
}));
