import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import People from "../models/people.model"; // i use this as User also
import RefreshToken from "../models/refreshToken.model";
import ErrorHandler from "../utils/errorhandler";
import { createAcessToken, createRefreshToken } from "../utils/jwtToken";
import sendMessage from "../utils/sendMessage";

export const registerUserController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password, home_phone, work_phone } = req.body;
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ErrorHandler(errors.array()[0].msg, 422);
    }

    const existingEmail = await People.findOne({ email });
    if (existingEmail) {
      return res.json({
        success: true,
        duplicate: true,
        message: "email already in used",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await People.create({
      email,
      name,
      password: hashedPassword,
      home_phone,
      work_phone,
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
      data: userResponse,
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
      return res.json({
        success: false,
        message: "email is not registered",
        // notFound: true,
        data: null,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid password",
        // notMatched: true,
        data: null,
      });
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
      data: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = catchAsyncError(async (req: any, res, next) => {
  const { newPassword, oldPassword } = req.body;

  const user = req.user;

  if (!newPassword || !oldPassword) {
    return res.json({
      success: false,
      data: null,
      message: "password, oldPassword and email => is required",
    });
  }
  console.log(user);

  const theUser = await People.findOne({ email: user?.email });

  // check if there no user
  if (!theUser) {
    return res.json({
      success: false,
      data: null,
      message: `no account found`,
    });
  }

  // varify old password
  const isOk = await bcrypt.compare(oldPassword, theUser.password as string);
  if (!isOk) {
    return res.json({ message: "Wrong password", success: false });
  }

  // create new hash password
  const newPass = await bcrypt.hash(newPassword, 15);

  // update the new
  const updatePassword = await People.findOneAndUpdate(
    { email: theUser.email },
    {
      $set: {
        password: newPass,
      },
    }
  );

  res.json({
    message: "password Updated",
    success: true,
    user: { ...updatePassword?.toObject(), password: "****" },
  });
});

// forgot-password controller
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;

  const user = await People.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "No user found with this email!" });
  }

  const tokenPayload = {
    email: user.email,
    _id: user._id,
  };

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "5m",
    }
  );
  console.log(
    `${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}`
  );

  sendMessage(
    "legendxpro123455@gmail.com",
    email,
    "Reset your password - Fresh Blogs",

    `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,${user?.name || ""}</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${
                    process.env.FRONTEND_BASE_URL
                  }/recover-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Fresh Blogs</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`
  );

  res.status(200).json({
    success: true,
    message: "Check your email to recover the password",
  });
});

// Resetting new password
export const recoverPassword = catchAsyncError(async (req, res) => {
  const { password } = req.body;
  const token = req.header("Authorization");
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  );
  if (!decoded)
    return res
      .status(401)
      .json({ success: false, message: "Invalid Authentication." });

  const user = await People.findOne({
    email: decoded.email,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  const tokenPayload = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  const accessToken = createAcessToken(tokenPayload, "1h");
  const refreshToken = createRefreshToken(tokenPayload);

  await user.save();
  await RefreshToken.findOneAndUpdate(
    { userId: user._id },
    { $set: { token: refreshToken } }
  );

  res.status(200).json({
    success: true,
    message: "Password has been successfully reset",
    refreshToken,
    accessToken,
  });
});

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
