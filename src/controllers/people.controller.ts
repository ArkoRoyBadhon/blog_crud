import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import peopleModel from "../models/people.model";

export const CreatePeopleController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    } else {
      try {
        const data = req.body;
        const result = await peopleModel.create(data);

        res.status(201).json({
          success: true,
          message: "SuccessFuly People created",
          result,
        });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error creating employee", error });
      }
    }
  }
);


export const getAllPeople = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const team = await peopleModel.find().populate('comments articles')
    return res.status(201).json({
      success: true,
      msg: "Get all users",
      team,
    });
  }
);
