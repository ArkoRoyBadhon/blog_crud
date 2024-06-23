import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import article from "../models/article";
import Tag from "../models/tags";
import Category from "../models/categories";

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
        const data = req.body;
        console.log("dta", data);

        const result = await article.create(data);

        // console.log("dta", result);
        if (!result) {
          return res.status(422).json({
            message: "Not Valid",
          });
        }
        if (result) {
          data?.tags?.map(async (tagId: string) => {
            await Tag.findByIdAndUpdate(tagId, {
              $push: { articles: result._id },
            });
          });
          data?.categories?.map(async (categoryId: string) => {
            await Category.findByIdAndUpdate(categoryId, {
              $push: { categories: result._id },
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
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error creating article",
        error,
      });
    }
  }
);


export const getAllArticleController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tags, categories, author, dateFrom, dateTo, searchText } = req.query;
      let filter: any = {};

      if (tags) {
        filter.tags = { $in: Array.isArray(tags) ? tags : (tags as string).split(',') };
      }

      if (categories) {
        filter.categories = { $in: Array.isArray(categories) ? categories : (categories as string).split(',') };
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
          { title: { $regex: searchText, $options: 'i' } },
          { text: { $regex: searchText, $options: 'i' } },
        ];
      }

      const result = await article.find(filter)
        .populate("tags")
        .populate("categories")
        .populate("comments")
        .populate("author");

      return res.status(200).json({
        success: true,
        msg: "Articles fetched successfully.",
        result,
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


export const getArticleByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await article
        .findById(id)
        .populate("tags")
        .populate("categories")
        .populate("comments")
        .populate("author");

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

      const result = await article.findByIdAndUpdate(id, data, {
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
      const result = await article.findByIdAndDelete(id);

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
