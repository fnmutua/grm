import mongoose from 'mongoose';
import Grievance from "../../models/grievance";

export default defineEventHandler(async (req) => {
    const { gbv,  filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('/api/summary/wordCloud..',filter_fields,filter_values);
 

         const grievances = await Grievance.find({}).toArray();


        return {
            message: 'summary found',
            result: grievances,
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
