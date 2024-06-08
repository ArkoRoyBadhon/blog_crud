import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import comments from "../models/comments";
import article from "../models/article";

export const createCommentController = catchAsyncError(
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
        const result = await comments.create(data);
        if (result) {
          console.log(data?.article);

          await article.findOneAndUpdate(
            { _id: data?.article },
            {
              $push: { comments: result?._id },
            }
          );
        }

        return res.status(200).json({
          success: true,
          msg: "Comment Created successfully.",
          result,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error creating Comment",
        error,
      });
    }
  }
);

export const deleteCommentController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;

    if (commentId) {
      const CommentFind = await comments.findById(commentId);
      const deleteComment = await comments.findByIdAndDelete(commentId);

      if (!deleteComment) {
        return res.status(404).json({
          success: false,
          msg: "Comment not found.",
        });
      }

      await article.updateOne(
        { _id: CommentFind?.article },
        { $pull: { comments: commentId }, new: true }
      );

      return res.status(201).json({
        success: true,
        msg: "Comment deleted successfully",
        deleteComment,
      });
    } else {
      return res.status(201).json({
        success: false,
        msg: "Comment deleted Failed",
      });
    }
  }
);
