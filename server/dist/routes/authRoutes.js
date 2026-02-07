"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = express_1.default.Router();
router.post('/login', validationMiddleware_1.validateLogin, authController_1.loginOrRegister);
router.post('/approve', authMiddleware_1.protect, authMiddleware_1.adminOnly, validationMiddleware_1.validateApproveUser, authController_1.approveUser);
router.get('/users', authMiddleware_1.protect, authMiddleware_1.adminOnly, authController_1.getUsers);
exports.default = router;
