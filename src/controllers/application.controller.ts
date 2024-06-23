import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import People from "../models/people.model";
import application from "../models/application";
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
        // console.log("dta", userId);

        const existApplication = await application.find({ userId });

        if (existApplication) {
          return res.status(422).json({
            errors: "Already Applied",
          });
        }

        const result = await application.create({ userId });

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
  const { userId } = req.params;

  try {
    const user = await People.findByIdAndUpdate(
      userId,
      { role: "author", verified: true },
      { new: true }
    );

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    await application.findByIdAndDelete({ userId });

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
