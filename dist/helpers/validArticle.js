"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArticle = void 0;
const express_validator_1 = require("express-validator");
exports.validateArticle = [
    (0, express_validator_1.check)("title", "Title is required and must be a string.")
        .isString()
        .notEmpty(),
    (0, express_validator_1.check)("date", "Date must be in ISO8601 format.")
        .optional()
        .isISO8601(),
    (0, express_validator_1.check)("text", "Text must be a string.")
        .optional()
        .isString(),
    (0, express_validator_1.check)("tags", "Tags must be an array of valid ObjectIds.")
        .optional()
        .isArray(),
    (0, express_validator_1.check)("tags.*", "Each tag must be a valid MongoId.")
        .optional()
        .isMongoId(),
    (0, express_validator_1.check)("categories", "Categories must be an array of valid ObjectIds.")
        .optional()
        .isArray(),
    (0, express_validator_1.check)("categories.*", "Each category must be a valid MongoId.")
        .optional()
        .isMongoId(),
    (0, express_validator_1.check)("comments", "Comments must be an array of valid ObjectIds.")
        .optional()
        .isArray(),
    (0, express_validator_1.check)("comments.*", "Each comment must be a valid MongoId.")
        .optional()
        .isMongoId(),
    (0, express_validator_1.check)("author", "Author is required and must be a valid MongoId.")
        .isMongoId()
        .notEmpty(),
];
