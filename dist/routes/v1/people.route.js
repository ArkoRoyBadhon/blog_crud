"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const people_controller_1 = require("../../controllers/people.controller");
const validPeople_1 = require("../../helpers/validPeople");
const router = express_1.default.Router();
// employee personal Data
router.post("/a/create", validPeople_1.validatePeople, people_controller_1.CreatePeopleController);
router.get("/all/get", people_controller_1.getAllPeople);
exports.default = router;
