"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tagSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    URL: {
        type: String,
        required: true,
    },
    articles: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Article",
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model("Tag", tagSchema);
