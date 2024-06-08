import { check } from "express-validator";

export const validateArticle = [
  check("title", "Title is required and must be a string.")
    .isString()
    .notEmpty(),
  check("date", "Date must be in ISO8601 format.")
    .optional()
    .isISO8601(),
  check("text", "Text must be a string.")
    .optional()
    .isString(),
  check("tags", "Tags must be an array of valid ObjectIds.")
    .optional()
    .isArray(),
  check("tags.*", "Each tag must be a valid MongoId.")
    .optional()
    .isMongoId(),
  check("categories", "Categories must be an array of valid ObjectIds.")
    .optional()
    .isArray(),
  check("categories.*", "Each category must be a valid MongoId.")
    .optional()
    .isMongoId(),
  check("comments", "Comments must be an array of valid ObjectIds.")
    .optional()
    .isArray(),
  check("comments.*", "Each comment must be a valid MongoId.")
    .optional()
    .isMongoId(),
  check("author", "Author is required and must be a valid MongoId.")
    .isMongoId()
    .notEmpty(),
];
