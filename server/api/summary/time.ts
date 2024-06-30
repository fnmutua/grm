import mongoose from 'mongoose';
import Grievance from "../../models/grievance";

export default defineEventHandler(async (req) => {
    const { gbv,  filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('/api/summary/time..' );
        const lastAddedDocument = await Grievance.findOne().sort({ createdAt: -1 }).exec();
        const lastAddedTime = lastAddedDocument ? lastAddedDocument.createdAt : null;
        
        console.log(lastAddedTime)


        const count = await Grievance.countDocuments({});



        let filterQuery: Record<string, any> = {};
        filterQuery.status = 'Resolved';

        const resolved = await Grievance.countDocuments(filterQuery);


        let result={}

        result.lastUpdate  = lastAddedTime
        result.received  = count
        result.resolved  = resolved
        result.resolution_rate  = (resolved/count)*100

        return {
            message: 'update',
            data: result,
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
      //  await mongoose.disconnect();
        console.log('Database disconnected...');
    }
});
