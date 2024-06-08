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
exports.getAllPeople = exports.CreatePeopleController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const people_model_1 = __importDefault(require("../models/people.model"));
exports.CreatePeopleController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    else {
        try {
            const data = req.body;
            const result = yield people_model_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "SuccessFuly People created",
                result,
            });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, message: "Error creating employee", error });
        }
    }
}));
exports.getAllPeople = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield people_model_1.default.find().populate('comments articles');
    return res.status(201).json({
        success: true,
        msg: "Get all users",
        team,
    });
}));
