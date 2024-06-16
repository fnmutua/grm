import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";
 
export default defineEventHandler(async (req) => {
    const { status,gbv, page, pageCount } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString,{dbName:'grm' });
        console.log('Database connected. Summary..');

        const count = await Grievance.countDocuments();
        
        return {
            message: 'summary found',
            data: count,
            code: '0000'
        };
      
    } catch (error) {
        console.error('Error during summary:', error);
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

