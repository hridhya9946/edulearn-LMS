import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.error('User not found!');
        } else {
            console.log(`Success! ${user.name} (${user.email}) is now an Admin.`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email: node promoteAdmin.js user@example.com');
} else {
    promoteToAdmin(email);
}
