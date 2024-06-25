import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Application from "../models/application";
import People from "../models/people.model";
import ErrorHandler from "../utils/errorhandler";

export const createApplicationController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
          errors: firstError,
        });
      } else {
        const userId = req.user?._id;
        console.log("dta", userId);

        const existApplication = await Application.findOne({ userId });

        if (existApplication) {
          return res.status(422).json({
            errors: "Already Applied",
            success: false,
            message: "Already aplplied",
          });
        }

        const result = await Application.create({ userId });

        if (!result) {
          return res.status(422).json({
            message: "Not Valid",
          });
        }

        return res.status(200).json({
          success: true,
          msg: "Application submitted successfully.",
          result,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error creating Application",
        error,
      });
    }
  }
);

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, userId } = req.body;

  try {
    if (status === "accepted") {
      const user = await People.findByIdAndUpdate(
        userId,
        { role: "author", verified: true },
        { new: true }
      );
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
    }

    await Application.findOneAndUpdate({ userId }, { $set: { status } });

    res.json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRequest = catchAsyncError(async (req, res) => {
  const { status } = req.query;
  const find: Record<string, unknown> = { status: "pending" };
  if (status) {
    find.status = status;
  }

  const result = await Application.find(find).populate("userId", "-password");
  res.json({
    success: true,
    message: "successfully get all application",
    data: result,
  });
});
