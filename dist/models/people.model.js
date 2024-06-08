"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const peopleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    home_phone: {
        type: String,
        required: true,
        unique: true,
    },
    work_phone: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
peopleSchema.virtual("articles", {
    ref: "Article",
    localField: "_id",
    foreignField: "author",
    justOne: false,
});
peopleSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "author",
    justOne: false,
});
peopleSchema.set("toObject", { virtuals: true });
peopleSchema.set("toJSON", { virtuals: true });
exports.default = mongoose_1.default.model("People", peopleSchema);
