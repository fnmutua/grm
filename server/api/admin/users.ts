import mongoose from 'mongoose';
import User from "./../../models/user";
 
 

export default defineEventHandler(async (req) => {
 

    const { page, pageCount } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

   
    try {
        await mongoose.connect(mongoString,{dbName:'grm' });
        console.log('Database connected...');

        // Calculate skip value for pagination
        const skip = (page - 1) * pageCount;

        // Find   based on status and include pagination
      // const data = await User.find().skip(skip).limit(pageCount);
        const data = await User.find().skip(skip).limit(pageCount).select('-password');

       // console.log('users',data)
 
        if (data.length === 0) {
            return {
                message: 'Users not found',
                data: [],
                code: '0000'
            };
        } else {
            // Fetch total count of grievances
            const totalCount = await User.countDocuments( );

            return {
                message: 'Users found',
                data: data,
                total: totalCount, // Return total count for pagination
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

