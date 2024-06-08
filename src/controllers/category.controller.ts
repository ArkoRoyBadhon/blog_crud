import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import Category from "../models/categories";
import Article from "../models/article";

export const createCategoryController = catchAsyncError(
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
        const result = await Category.create(data);

        return res.status(200).json({
          success: true,
          msg: "Category Created successfully.",
          result,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error creating Category data",
        error,
      });
    }
  }
);

export const deleteCategoryController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        msg: "Category ID is required.",
      });
    }

    try {
      // const categoryOperation = await Category.findByIdAndDelete(categoryId);
      const categoryOperation = await Category.findById(categoryId);

      console.log("delete", categoryOperation);

      if (!categoryOperation) {
        res.status(200).json({
          success: true,
          msg: "Category delete failed",
        });
      }

      const updateResult = await Article.updateMany(
        { categories: categoryId },
        { $pull: { categories: categoryId } }
      ).exec();

      // Return the articles found
      return res.status(200).json({
        success: true,
        msg: "delete successfully",
        updateResult,
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



export const getCategoriesController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Category.find();

      if (!category) {
        return res.status(404).json({
          success: false,
          msg: "Category not found.",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Category fetched successfully.",
        category,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error fetching category",
        error,
      });
    }
  }
);
export const getCategoryByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        msg: "Category ID is required.",
      });
    }

    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          msg: "Category not found.",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Category fetched successfully.",
        category,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error fetching category",
        error,
      });
    }
  }
);


export const updateCategoryController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        msg: "Category ID is required.",
      });
    }

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
          errors: firstError,
        });
      } else {
        const data = req.body;
        const category = await Category.findByIdAndUpdate(categoryId, data, {
          new: true,
          runValidators: true,
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            msg: "Category not found.",
          });
        }

        return res.status(200).json({
          success: true,
          msg: "Category updated successfully.",
          category,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error updating category",
        error,
      });
    }
  }
);
