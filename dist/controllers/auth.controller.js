"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword = exports.forgotPassword = exports.resetPassword = exports.getAccessToken = exports.authSateController = exports.signinController = exports.registerUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const people_model_1 = __importDefault(require("../models/people.model")); // i use this as User also
const refreshToken_model_1 = __importDefault(require("../models/refreshToken.model"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const jwtToken_1 = require("../utils/jwtToken");
const sendMessage_1 = __importDefault(require("../utils/sendMessage"));
exports.registerUserController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, home_phone, work_phone } = req.body;
    console.log(req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorhandler_1.default(errors.array()[0].msg, 422);
    }
    const existingEmail = yield people_model_1.default.findOne({ email });
    if (existingEmail) {
        return res.json({
            success: true,
            duplicate: true,
            message: "email already in used",
            data: null,
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield people_model_1.default.create({
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
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload);
    const userWithoutPassword = user.toObject();
    const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    yield refreshToken_model_1.default.create({
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
}));
const signinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorhandler_1.default(errors.array()[0].msg, 422);
        }
        const user = yield people_model_1.default.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "email is not registered",
                // notFound: true,
                data: null,
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
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
        const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
        const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload); // expire time => 30 day
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        yield refreshToken_model_1.default.create({
            token: refreshToken,
            userId: user._id,
            expiration_time: expiresAt,
        });
        const userWithoutPassword = user.toObject();
        const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
        return res.json({
            success: true,
            message: "Signin success",
            data: userResponse,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signinController = signinController;
exports.authSateController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ success: true, message: "User state get", data: user });
}));
const getAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; /// refresh token
    if (!token)
        return res.sendStatus(401);
    // asdfasfd. decode
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    try {
        const refreshToken = yield refreshToken_model_1.default.findOne({
            token,
        });
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Unauthotized" });
        }
        const today = new Date().getTime();
        if (today > refreshToken.expiration_time) {
            return res.status(401).json({ success: false, message: "Unauthotized" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken.token, refreshSecret);
        const tokenUser = decoded.user;
        // checking if the user is exist
        const user = yield people_model_1.default.findOne({ email: tokenUser.email });
        if (!user) {
            throw new errorhandler_1.default("This user is not found !", 404);
        }
        const jwtPayload = {
            userId: user.id,
            role: user.role,
        };
        const accessToken = (0, jwtToken_1.createAcessToken)(jwtPayload, "1h");
        res.json({
            success: true,
            data: null,
            message: "access token retive successfully",
            token: accessToken,
        });
    }
    catch (error) {
        res.status(401).json({ success: false, message: "unautorized access" });
    }
});
exports.getAccessToken = getAccessToken;
// change password
exports.resetPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const theUser = yield people_model_1.default.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
    // check if there no user
    if (!theUser) {
        return res.json({
            success: false,
            data: null,
            message: `no account found`,
        });
    }
    // varify old password
    const isOk = yield bcrypt_1.default.compare(oldPassword, theUser.password);
    if (!isOk) {
        return res.json({ message: "Wrong password", success: false });
    }
    // create new hash password
    const newPass = yield bcrypt_1.default.hash(newPassword, 15);
    // update the new
    const updatePassword = yield people_model_1.default.findOneAndUpdate({ email: theUser.email }, {
        $set: {
            password: newPass,
        },
    });
    res.json({
        message: "password Updated",
        success: true,
        user: Object.assign(Object.assign({}, updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.toObject()), { password: "****" }),
    });
}));
// forgot-password controller
exports.forgotPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield people_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: "No user found with this email!" });
    }
    const tokenPayload = {
        email: user.email,
        _id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "5m",
    });
    console.log(`${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}`);
    (0, sendMessage_1.default)("legendxpro123455@gmail.com", email, "Reset your password - Fresh Blogs", `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,${(user === null || user === void 0 ? void 0 : user.name) || ""}</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Fresh Blogs</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`);
    res.status(200).json({
        success: true,
        message: "Check your email to recover the password",
    });
}));
// Resetting new password
exports.recoverPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const token = req.header("Authorization");
    if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded)
        return res
            .status(401)
            .json({ success: false, message: "Invalid Authentication." });
    const user = yield people_model_1.default.findOne({
        email: decoded.email,
    });
    if (!user) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "User not found",
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    user.password = hashedPassword;
    const tokenPayload = {
        email: user.email,
        userId: user._id,
        role: user.role,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload);
    yield user.save();
    yield refreshToken_model_1.default.findOneAndUpdate({ userId: user._id }, { $set: { token: refreshToken } });
    res.status(200).json({
        success: true,
        message: "Password has been successfully reset",
        refreshToken,
        accessToken,
    });
}));
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
