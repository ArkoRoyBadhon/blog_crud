import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import People from "../models/people.model"; // i use this as User also
import ErrorHandler from "../utils/errorhandler";
import { createAcessToken, createRefreshToken } from "../utils/jwtToken";
import RefreshToken from "../models/refreshToken.model";
import bcrypt from "bcrypt";


export const registerUserController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password, home_phone, work_phone, role } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ErrorHandler(errors.array()[0].msg, 422);
    }

    const existingEmail = await People.findOne({ email });
    if (existingEmail) {
      throw new ErrorHandler("This email is already used!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await People.create({
      email,
      name,
      password: hashedPassword,
      home_phone,
      work_phone
    });

    const tokenPayload = {
      email: user.email,
      userId: user._id,
      role: user.role,
    };

    const accessToken = createAcessToken(tokenPayload, "1h");
    const refreshToken = createRefreshToken(tokenPayload);
    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiration_time: expiresAt,
    });

    return res.json({
      success: true,
      message: "Account created successfully",
      accessToken,
      refreshToken,
      user: userResponse,
    });
  }
);

export const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ErrorHandler(errors.array()[0].msg, 422);
    }
    const user = await People.findOne({ email });
    if (!user) {
      throw new ErrorHandler("Email is not registered", 400);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ErrorHandler("Password is not match", 400);
    }
    const tokenPayload = {
      email: user.email,
      userId: user._id,

      role: user.role,
    };

    const accessToken = createAcessToken(tokenPayload, "1h");
    const refreshToken = createRefreshToken(tokenPayload); // expire time => 30 day

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiration_time: expiresAt,
    });

    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    return res.json({
      success: true,
      message: "Signin success",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


// export const CreatePeopleController = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       const firstError = errors.array().map((error) => error.msg)[0];
//       return res.status(422).json({
//         errors: firstError,
//       });
//     } else {
//       try {
//         const data = req.body;
//         const result = await peopleModel.create(data);

//         res.status(201).json({
//           success: true,
//           message: "SuccessFuly People created",
//           result,
//         });
//       } catch (error) {
//         res
//           .status(500)
//           .json({ success: false, message: "Error creating employee", error });
//       }
//     }
//   }
// );


// export const getAllPeople = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const team = await peopleModel.find().populate('comments articles')
//     return res.status(201).json({
//       success: true,
//       msg: "Get all users",
//       team,
//     });
//   }
// );
