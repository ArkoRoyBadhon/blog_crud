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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequest = exports.updateUserRoleController = exports.createApplicationController = void 0;
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const application_1 = __importDefault(require("../models/application"));
const people_model_1 = __importDefault(require("../models/people.model"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
exports.createApplicationController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map((error) => error.msg)[0];
            return res.status(422).json({
                errors: firstError,
            });
        }
        else {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            console.log("dta", userId);
            const existApplication = yield application_1.default.findOne({ userId });
            if (existApplication) {
                return res.status(422).json({
                    errors: "Already Applied",
                    success: false,
                    message: "Already aplplied",
                });
            }
            const result = yield application_1.default.create({ userId });
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error creating Application",
            error,
        });
    }
}));
const updateUserRoleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, userId } = req.body;
    try {
        if (status === "accepted") {
            const user = yield people_model_1.default.findByIdAndUpdate(userId, { role: "author", verified: true }, { new: true });
            if (!user) {
                throw new errorhandler_1.default("User not found", 404);
            }
        }
        yield application_1.default.findOneAndUpdate({ userId }, { $set: { status } });
        res.json({
            success: true,
            message: "User role updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserRoleController = updateUserRoleController;
exports.getAllRequest = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    const find = { status: "pending" };
    if (status) {
        find.status = status;
    }
    const result = yield application_1.default.find(find).populate("userId", "-password");
    res.json({
        success: true,
        message: "successfully get all application",
        data: result,
    });
}));
