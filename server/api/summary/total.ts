import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";
 
// export default defineEventHandler(async (req) => {
//     const { status,gbv, page, pageCount, filter_fields,filter_values} = await readBody(req);
//     const mongoString = process.env.MONGODB_URI;

//     try {
//         await mongoose.connect(mongoString,{dbName:'grm' });
//         console.log('/api/summary/total');

//         const count = await Grievance.countDocuments({[filter_fields]:filter_values});
        
//         return {
//             message: 'summary found',
//             data: count,
//             code: '0000'
//         };
      
//     } catch (error) {
//         console.error('Error during summary:', error);
//         return {
//             message: 'Internal server error',
//             code: '9999'
//         };
//     } finally {
//         // Close the MongoDB connection
//         // await mongoose.disconnect();
//         // console.log('Database disconnected...');
//     }
// });

export default defineEventHandler(async (req) => {
    const { status, gbv, page, pageCount, filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('/api/summary/total');

        // Construct the filter query dynamically
        let filterQuery: Record<string, any> = {};
        
        if (Array.isArray(filter_fields) && Array.isArray(filter_values) && filter_fields.length === filter_values.length) {
            if (filter_fields.includes(null) || filter_values.includes(null)) {
                filterQuery = {}; // Return all documents if any filter field or value is null
            } else {
                filter_fields.forEach((field, index) => {
                    filterQuery[field] = filter_values[index];
                });
            }
        } else {
            throw new Error('filter_fields and filter_values must be arrays of the same length');
        }

        const count = await Grievance.countDocuments(filterQuery);
        console.log(filterQuery)
        
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
        console.log('Database disconnected...');
    }
});