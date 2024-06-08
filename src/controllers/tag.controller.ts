import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import Tag from "../models/tags";
import article from "../models/article";

export const createTagController = catchAsyncError(
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
        const result = await Tag.create(data)

        return res.status(200).json({
          success: true,
          msg: "Tag Created successfully.",
          result
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error creating tag data",
        error,
      });
    }
  }
);


export const deleteTagController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const TagId = req.params.id;

    if (!TagId) {
      return res.status(400).json({
        success: false,
        msg: "Tag ID is required.",
      });
    }

    try {
      const TagOperation = await Tag.findByIdAndDelete(TagId);
      // const TagOperation = await Tag.findById(TagId);

      console.log("delete", TagOperation);

      if (!TagOperation) {
        res.status(200).json({
          success: true,
          msg: "Tag delete failed",
        });
      }

      const updateResult = await article.updateMany(
        { tags: TagId },
        { $pull: { tags: TagId } }
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


export const getTagsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    try {
      const tag = await Tag.find();

      if (!tag) {
        return res.status(404).json({
          success: false,
          msg: "Tag not found.",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Tag fetched successfully.",
        tag,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error fetching tag",
        error,
      });
    }
  }
);
export const getTagByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const tagId = req.params.id;

    if (!tagId) {
      return res.status(400).json({
        success: false,
        msg: "Tag ID is required.",
      });
    }

    try {
      const tag = await Tag.findById(tagId);

      if (!tag) {
        return res.status(404).json({
          success: false,
          msg: "Tag not found.",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Tag fetched successfully.",
        tag,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error fetching tag",
        error,
      });
    }
  }
);


export const updateTagController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const tagId = req.params.id;

    if (!tagId) {
      return res.status(400).json({
        success: false,
        msg: "Tag ID is required.",
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
        const tag = await Tag.findByIdAndUpdate(tagId, data, {
          new: true,
          runValidators: true,
        });

        if (!tag) {
          return res.status(404).json({
            success: false,
            msg: "Tag not found.",
          });
        }

        return res.status(200).json({
          success: true,
          msg: "Tag updated successfully.",
          tag,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error updating tag",
        error,
      });
    }
  }
);

