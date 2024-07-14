import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";

// Define a Mongoose schema for grievances
const grievanceSchema = new mongoose.Schema({
    // Define the schema fields as needed
    // For example:
    title: String,
    description: String,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define the Mongoose model for grievances
// const Grievance = mongoose.model('Grievance', grievanceSchema);

export default defineEventHandler(async (req) => {
    const { status, gbv, page, pageCount } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('Database connected...');

        // Calculate skip value for pagination
        const skip = (page - 1) * pageCount;
        let qry_obj = {};
        if (gbv) {
            qry_obj.status = status;
            qry_obj.gbv = gbv;
        } else {
            qry_obj.status = status;
            qry_obj.gbv = { $ne: 'Yes' };
        }
        console.log(qry_obj);

        // Find grievances based on status and include pagination, sorted by createdAt in descending order
        const data = await Grievance.find(qry_obj).sort({ createdAt: -1 }).skip(skip).limit(pageCount);

        if (data.length === 0) {
            return {
                message: 'Grievances not found',
                data: [],
                code: '0000'
            };
        } else {
            // Fetch total count of grievances
            const totalCount = await Grievance.countDocuments({ status: status });

            return {
                message: 'Grievances found',
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
