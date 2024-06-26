import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Article from "../models/article";
import Category from "../models/categories";
import Tag from "../models/tags";
import Visit from "../models/visitSchema";

export const createArticleController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
          errors: firstError,
        });
      } else {
        const { tag, category, ...restData } = req.body;
        const data = {
          ...restData,
          tags: tag,
          categories: category,
        };
        console.log("Received data:", data);

        const result = await Article.create(data);

        if (!result) {
          return res.status(422).json({
            message: "Not Valid",
          });
        }

        if (result) {
          tag?.map(async (tagId: string) => {
            await Tag.findByIdAndUpdate(tagId, {
              $push: { articles: result._id },
            });
          });

          category?.map(async (categoryId: string) => {
            await Category.findByIdAndUpdate(categoryId, {
              $push: { articles: result._id },
            });
          });
        }

        return res.status(200).json({
          success: true,
          msg: "Article created successfully.",
          result,
        });
      }
    } catch (error) {
      console.error("Error creating article:", error);
      return res.status(500).json({
        success: false,
        msg: "Error creating article",
        error,
      });
    }
  }
);

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

export const getAllArticleController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        tags,
        categories,
        author,
        dateFrom,
        dateTo,
        searchText,
        mostVisited,
        page,
        limit = 10,
      } = req.query;
      let filter: any = {};

      const pageInNumber = parseInt((page as string) || "0") || 1;
      const limitInNumber = parseInt(limit as string);
      const skip = (pageInNumber - 1) * limitInNumber;
      if (tags) {
        filter.tags = {
          $in: Array.isArray(tags) ? tags : (tags as string).split(","),
        };
      }

      if (categories) {
        filter.categories = {
          $in: Array.isArray(categories)
            ? categories
            : (categories as string).split(","),
        };
      }

      if (author) {
        filter.author = author;
      }

      if (dateFrom || dateTo) {
        filter.date = {};
        if (dateFrom) {
          filter.date.$gte = new Date(dateFrom as string);
        }
        if (dateTo) {
          filter.date.$lte = new Date(dateTo as string);
        }
      }

      if (searchText) {
        filter.$or = [
          { title: { $regex: searchText, $options: "i" } },
          { text: { $regex: searchText, $options: "i" } },
        ];
      }

      let query = Article.find(filter)
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
      const totalDoc = await Article.countDocuments(filter);

      const result = await query;
      return res.status(200).json({
        success: true,
        msg: "Articles fetched successfully.",
        result,
        totalPage: Math.ceil(totalDoc / limitInNumber),
        limit: limitInNumber,
        page: pageInNumber,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error fetching articles",
        error,
      });
    }
  }
);

export const getRecentBlogs = catchAsyncError(async (req, res) => {
  const { tags, categories, limit } = req.query;
  const limitNumber = Number(limit || "0");
  let filter: any = {};

  if (tags) {
    filter.tags = {
      $in: Array.isArray(tags) ? tags : (tags as string).split(","),
    };
  }

  if (categories) {
    filter.categories = {
      $in: Array.isArray(categories)
        ? categories
        : (categories as string).split(","),
    };
  }

  const result = await Article.find(filter)
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
});

export const getArticleByUserIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const id = req.params.id;
      const userId = req?.user?._id;

      console.log("authorr---", userId);

      const result = await Article.find({ author: userId })
        .populate("tags")
        .populate("categories")
        .populate("comments")
        .populate("author", "-password");

      return res.status(200).json({
        success: true,
        msg: "Article fetched successfully.",
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error Fetching article",
        error,
      });
    }
  }
);
export const getArticleByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.query.userId;

      const result = await Article.findById(id)
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
        const isVisitedBefore = await Visit.findOne({ userId, article: id });
        if (!isVisitedBefore) {
          await Visit.create({ article: id, userId });
          await Article.findByIdAndUpdate(result?._id, { $inc: { visit: 1 } });
        }
      }
      return res.status(200).json({
        success: true,
        msg: "Article fetched successfully.",
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error Fetching article",
        error,
      });
    }
  }
);

export const updateArticleByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data = req.body;

      const result = await Article.findByIdAndUpdate(id, data, {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error updating article",
        error,
      });
    }
  }
);

export const deleteArticleByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await Article.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        msg: "Article deleted successfully.",
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error Deleting article",
        error,
      });
    }
  }
);
