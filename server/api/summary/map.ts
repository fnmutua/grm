import mongoose from 'mongoose';
import Grievance from "../../models/grievance";
import Settlement from "../../models/settlement"; // Assuming you have a Settlement model

export default defineEventHandler(async (req) => {
    const { gbv, filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;
    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('/api/summary/all..', filter_fields, filter_values);

        // Construct the filter query dynamically
        let filterQuery = {};
        if (Array.isArray(filter_fields) && Array.isArray(filter_values) && filter_fields.length === filter_values.length) {
            filter_fields.forEach((field, index) => {
                if (filter_values[index] !== null && filter_values[index] !== undefined) {
                    filterQuery[field] = filter_values[index];
                }
            });
        }

        // Always include the gbv filter if provided
        if (gbv) {
            filterQuery.gbv = gbv;
        }

        console.log('filterQuery>>>><<<<', filterQuery);

        const count = await Grievance.countDocuments(filterQuery);

        const countMap = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
        
            // Group by status and count occurrences
            {
                $group: {
                    _id: "$status", // Group by status field
                    count: { $sum: 1 } // Count documents for each status
                }
            },
        
            // Project to calculate percentage
            {
                $project: {
                    _id: 0, // Exclude _id field
                    status: "$_id", // Rename _id to status
                    percentage: {
                        $round: [
                            { $multiply: [
                                { $divide: ["$count", count] }, // Calculate proportion
                                100 // Convert to percentage
                            ] },
                            2 // Round to 2 decimal places
                        ]
                    }
                }
            }
        ]);

        const grievances = await Grievance.aggregate([
            { $match: filterQuery },
            {
                $lookup: {
                    from: 'settlements',
                    localField: 'settlement_id', // Assuming this is the field linking to settlements
                    foreignField: 'code', // Adjust if necessary
                    as: 'settlement'
                }
            },
            { $unwind: '$settlement' }, // Deconstruct the settlement array
            {
                $project: {
                    _id: 0, // Exclude _id field
                    grievance_code: '$code',
                    status: 1,
                    geometry: '$settlement.geometry' // Assuming 'geometry' is the GeoJSON field in Settlement schema
                }
            }
        ]);

        let result = {
            countMap,
            grievances
        };

        return {
            message: 'summary found',
            result: result,
            code: '0000'
        };

    } catch (error) {
        console.error('Error during summary:', error);
        return {
            message: 'Internal server error',
            code: '9999'
        };
    } finally {
        console.log('Database disconnected...');
    }
});
