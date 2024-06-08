"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePeople = void 0;
const express_validator_1 = require("express-validator");
exports.validatePeople = [
    (0, express_validator_1.check)("name", "Name is required")
        .isLength({ min: 3 }),
];
