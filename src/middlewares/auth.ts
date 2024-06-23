import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import People from "../models/people.model";
import ErrorHandler from "../utils/errorhandler";

export const isAuthenticatedUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");

    if (!getToken)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const token = getToken.split(" ")[1];
    console.log(token);
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await People.findOne({ _id: decoded?.user?.userId }).select(
      "-password"
    );
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    req.user = user;

    next();
  } catch (err: any) {
    console.log(err);

    return res.status(500).json({ msg: err.message });
  }
};

export const authorizeRoles = (...roles: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    console.log("role =======", roles);

    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `User type: ${req.user?.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};
