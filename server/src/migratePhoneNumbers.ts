import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

/**
 * Migration Script: Hash Existing Phone Numbers
 * 
 * This script migrates existing users with plain-text phone numbers
 * to hashed phone numbers for improved security.
 * 
 * WARNING: This is a one-way migration. Make a database backup first!
 */

const migratePhoneNumbers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to DB');

        const users = await User.find();
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
            const hashedPhone = await User.hashPhoneNumber(plainPhone);

            user.phoneNumber = hashedPhone;
            await user.save();

            console.log(`User ${user._id}: Migrated successfully`);
            migratedCount++;
        }

        console.log(`\n=== Migration Complete ===`);
        console.log(`Migrated: ${migratedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Total: ${users.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Migration Error:', error);
        process.exit(1);
    }
};

migratePhoneNumbers();
