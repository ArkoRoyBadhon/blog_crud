"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false,
    },
    URL: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: true,
    },
    article: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "People",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model("Comment", commentSchema);
