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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const promoteToAdmin = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        // Find user by comparing hashed phone numbers
        const allUsers = yield User_1.default.find();
        let user = null;
        for (const u of allUsers) {
            if (yield u.comparePhoneNumber(phoneNumber)) {
                user = u;
                break;
            }
        }
        if (!user) {
            console.log(`User ${phoneNumber} not found. Creating new Admin user...`);
            const hashedPhone = yield User_1.default.hashPhoneNumber(phoneNumber);
            user = yield User_1.default.create({
                phoneNumber: hashedPhone,
                isApproved: true,
                isAdmin: true,
                role: 'admin'
            });
        }
        else {
            console.log(`User found. Promoting to Admin...`);
            user.isAdmin = true;
            user.role = 'admin';
            user.isApproved = true;
            yield user.save();
        }
        console.log(`SUCCESS: User is now an Admin.`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
});
const phoneArg = process.argv[2];
if (!phoneArg) {
    console.error('Please provide a phone number. Example: npx ts-node src/seedAdmin.ts +1234567890');
    process.exit(1);
}
promoteToAdmin(phoneArg);
