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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleByIdController = exports.updateArticleByIdController = exports.getArticleByIdController = exports.getArticleByUserIdController = exports.getRecentBlogs = exports.getAllArticleController = exports.createArticleController = void 0;
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const article_1 = __importDefault(require("../models/article"));
const categories_1 = __importDefault(require("../models/categories"));
const tags_1 = __importDefault(require("../models/tags"));
const visitSchema_1 = __importDefault(require("../models/visitSchema"));
exports.createArticleController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map((error) => error.msg)[0];
            return res.status(422).json({
                errors: firstError,
            });
        }
        else {
            const _a = req.body, { tag, category } = _a, restData = __rest(_a, ["tag", "category"]);
            const data = Object.assign(Object.assign({}, restData), { tags: tag, categories: category });
            console.log("Received data:", data);
            const result = yield article_1.default.create(data);
            if (!result) {
                return res.status(422).json({
                    message: "Not Valid",
                });
            }
            if (result) {
                tag === null || tag === void 0 ? void 0 : tag.map((tagId) => __awaiter(void 0, void 0, void 0, function* () {
                    yield tags_1.default.findByIdAndUpdate(tagId, {
                        $push: { articles: result._id },
                    });
                }));
                category === null || category === void 0 ? void 0 : category.map((categoryId) => __awaiter(void 0, void 0, void 0, function* () {
                    yield categories_1.default.findByIdAndUpdate(categoryId, {
                        $push: { articles: result._id },
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
        console.error("Error creating article:", error);
        return res.status(500).json({
            success: false,
            msg: "Error creating article",
            error,
        });
    }
}));
// export const createArticleController = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         const firstError = errors.array().map((error) => error.msg)[0];
//         return res.status(422).json({
//           errors: firstError,
//         });
//       } else {
//         const data = req.body;
//         console.log("daaaaaaaaaa", data);
//         const result = await Article.create(data);
//         // console.log("dta", result);
//         if (!result) {
//           return res.status(422).json({
//             message: "Not Valid",
//           });
//         }
//         if (result) {
//           data?.tags?.map(async (tagId: string) => {
//             await Tag.findByIdAndUpdate(tagId, {
//               $push: { articles: result._id },
//             });
//           });
//           data?.categories?.map(async (categoryId: string) => {
//             await Category.findByIdAndUpdate(categoryId, {
//               $push: { categories: result._id },
//             });
//           });
//         }
//         return res.status(200).json({
//           success: true,
//           msg: "Article created successfully.",
//           result,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         success: false,
//         msg: "Error creating article",
//         error,
//       });
//     }
//   }
// );
exports.getAllArticleController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tags, categories, author, dateFrom, dateTo, searchText, mostVisited, page, limit = 10, } = req.query;
        let filter = {};
        const pageInNumber = parseInt(page || "0") || 1;
        const limitInNumber = parseInt(limit);
        const skip = (pageInNumber - 1) * limitInNumber;
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
            query = query.sort({ visit: -1 }).limit(limitInNumber);
        }
        if (page) {
            query = query.skip(skip).limit(limitInNumber);
        }
        const totalDoc = yield article_1.default.countDocuments(filter);
        const result = yield query;
        return res.status(200).json({
            success: true,
            msg: "Articles fetched successfully.",
            result,
            totalPage: Math.ceil(totalDoc / limitInNumber),
            limit: limitInNumber,
            page: pageInNumber,
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
        .populate("tags")
        .populate("categories")
        .populate("comments")
        .populate("author", "-password")
        .sort({ createdAt: -1 })
        .limit(limitNumber || 5);
    res.status(200).json({
        success: true,
        msg: "Recent 5 Article fetched successfully.",
        result,
    });
}));
exports.getArticleByUserIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // const id = req.params.id;
        const userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
        console.log("authorr---", userId);
        const result = yield article_1.default.find({ author: userId })
            .populate("tags")
            .populate("categories")
            .populate("comments")
            .populate("author", "-password");
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
exports.getArticleByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.query.userId;
        const result = yield article_1.default.findById(id)
            .populate({ path: "tags" })
            .populate({ path: "categories" })
            .populate({
            path: "comments",
            populate: {
                path: "author",
                select: "-password",
            },
        })
            .populate({
            path: "author",
            select: "-password",
        });
        if (userId) {
            const isVisitedBefore = yield visitSchema_1.default.findOne({ userId, article: id });
            if (!isVisitedBefore) {
                yield visitSchema_1.default.create({ article: id, userId });
                yield article_1.default.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result._id, { $inc: { visit: 1 } });
            }
        }
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
