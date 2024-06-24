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
exports.signinController = exports.registerUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const people_model_1 = __importDefault(require("../models/people.model")); // i use this as User also
const refreshToken_model_1 = __importDefault(require("../models/refreshToken.model"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const jwtToken_1 = require("../utils/jwtToken");
exports.registerUserController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, home_phone, work_phone } = req.body;
    console.log(req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorhandler_1.default(errors.array()[0].msg, 422);
    }
    const existingEmail = yield people_model_1.default.findOne({ email });
    if (existingEmail) {
        throw new errorhandler_1.default("This email is already used!", 400);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield people_model_1.default.create({
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
        user: userResponse,
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
            throw new errorhandler_1.default("Email is not registered", 400);
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new errorhandler_1.default("Password is not match", 400);
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
            user: userResponse,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signinController = signinController;
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
