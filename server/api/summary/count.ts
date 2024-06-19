import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";
 
export default defineEventHandler(async (req) => {
    const { status, gbv, page, pageCount, filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('Database connected. Summary..');

        // Construct the filter query dynamically
        let filterQuery: Record<string, any> = { status };

        if (Array.isArray(filter_fields) && Array.isArray(filter_values) && filter_fields.length === filter_values.length) {
            filter_fields.forEach((field, index) => {
                if (filter_values[index] !== null && filter_values[index] !== undefined) {
                    filterQuery[field] = filter_values[index];
                }
            });
        }

        const count = await Grievance.countDocuments(filterQuery);
        console.log('/api/summary/count', count, filterQuery)

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

