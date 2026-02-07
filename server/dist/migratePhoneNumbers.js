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
/**
 * Migration Script: Hash Existing Phone Numbers
 *
 * This script migrates existing users with plain-text phone numbers
 * to hashed phone numbers for improved security.
 *
 * WARNING: This is a one-way migration. Make a database backup first!
 */
const migratePhoneNumbers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const users = yield User_1.default.find();
        console.log(`Found ${users.length} users to migrate`);
        let migratedCount = 0;
        let skippedCount = 0;
        for (const user of users) {
            // Check if phone number is already hashed (bcrypt hashes start with $2)
            if (user.phoneNumber.startsWith('$2')) {
                console.log(`User ${user._id}: Already hashed, skipping`);
                skippedCount++;
                continue;
            }
            // Hash the plain-text phone number
            const plainPhone = user.phoneNumber;
            const hashedPhone = yield User_1.default.hashPhoneNumber(plainPhone);
            user.phoneNumber = hashedPhone;
            yield user.save();
            console.log(`User ${user._id}: Migrated successfully`);
            migratedCount++;
        }
        console.log(`\n=== Migration Complete ===`);
        console.log(`Migrated: ${migratedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Total: ${users.length}`);
        process.exit(0);
    }
    catch (error) {
        console.error('Migration Error:', error);
        process.exit(1);
    }
});
migratePhoneNumbers();
