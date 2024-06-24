"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const application_controller_1 = require("../../controllers/application.controller");
const router = express_1.default.Router();
// employee personal Data
router.post("/a/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("regular"), application_controller_1.createApplicationController);
router.post("/a/update", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), application_controller_1.updateUserRoleController);
exports.default = router;
