"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/login', authController_1.loginOrRegister);
router.post('/approve', authController_1.approveUser); // Needs middleware protectAdmin but keeping simple for now
router.get('/users', authController_1.getUsers); // Needs middleware protectAdmin
exports.default = router;
