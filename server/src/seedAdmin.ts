import mongoose from 'mongoose';
import checkEnv from 'dotenv';
import User from './models/User';

checkEnv.config();

const promoteToAdmin = async (phoneNumber: string) => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to DB');

        // Find user by comparing hashed phone numbers
        const allUsers = await User.find();
        let user = null;

        for (const u of allUsers) {
            if (await u.comparePhoneNumber(phoneNumber)) {
                user = u;
                break;
            }
        }

        if (!user) {
            console.log(`User ${phoneNumber} not found. Creating new Admin user...`);
            const hashedPhone = await User.hashPhoneNumber(phoneNumber);
            user = await User.create({
                phoneNumber: hashedPhone,
                isApproved: true,
                isAdmin: true,
                role: 'admin'
            });
        } else {
            console.log(`User found. Promoting to Admin...`);
            user.isAdmin = true;
            user.role = 'admin';
            user.isApproved = true;
            await user.save();
        }

        console.log(`SUCCESS: User is now an Admin.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const phoneArg = process.argv[2];
if (!phoneArg) {
    console.error('Please provide a phone number. Example: npx ts-node src/seedAdmin.ts +1234567890');
    process.exit(1);
}

promoteToAdmin(phoneArg);
