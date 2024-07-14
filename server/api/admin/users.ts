import mongoose from 'mongoose';
import User from "./../../models/user";

export default defineEventHandler(async (req) => {
    const { page, pageCount, user_id } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('Database connected...');

        // Calculate skip value for pagination
        const skip = (page - 1) * pageCount;

        // Define query conditions to exclude user by user_id
        const query = { _id: { $ne: (user_id) } };

        // Find users based on query, excluding the specified user
        const data = await User.find(query)
            .skip(skip)
            .limit(pageCount)
            .select('-password'); // Exclude password field from results

        if (data.length === 0) {
            return {
                message: 'Users not found',
                data: [],
                code: '0000'
            };
        } else {
            // Fetch total count of users (excluding the specified user)
            const totalCount = await User.countDocuments(query);

            return {
                message: 'Users found',
                data: data,
                total: totalCount,
                code: '0000'
            };
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return {
            message: 'Internal server error',
            code: '9999'
        };
    } finally {
        // Close the MongoDB connection
        // await mongoose.disconnect();
        // console.log('Database disconnected...');
    }
});
