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
exports.deleteCommentController = exports.createCommentController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const comments_1 = __importDefault(require("../models/comments"));
const article_1 = __importDefault(require("../models/article"));
exports.createCommentController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const result = yield comments_1.default.create(data);
            if (result) {
                console.log(data === null || data === void 0 ? void 0 : data.article);
                yield article_1.default.findOneAndUpdate({ _id: data === null || data === void 0 ? void 0 : data.article }, {
                    $push: { comments: result === null || result === void 0 ? void 0 : result._id },
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Comment Created successfully.",
                result,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error creating Comment",
            error,
        });
    }
}));
exports.deleteCommentController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    if (commentId) {
        const CommentFind = yield comments_1.default.findById(commentId);
        const deleteComment = yield comments_1.default.findByIdAndDelete(commentId);
        if (!deleteComment) {
            return res.status(404).json({
                success: false,
                msg: "Comment not found.",
            });
        }
        yield article_1.default.updateOne({ _id: CommentFind === null || CommentFind === void 0 ? void 0 : CommentFind.article }, { $pull: { comments: commentId }, new: true });
        return res.status(201).json({
            success: true,
            msg: "Comment deleted successfully",
            deleteComment,
        });
    }
    else {
        return res.status(201).json({
            success: false,
            msg: "Comment deleted Failed",
        });
    }
}));
