import mongoose from 'mongoose';
import Grievance from "../../models/grievance";

export default defineEventHandler(async (req) => {
    const { gbv,  filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('/api/summary/all..',filter_fields,filter_values);

        // Construct the filter query dynamically
        let filterQuery: Record<string, any> = {};
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

      
    


        const count = await Grievance.countDocuments(filterQuery);

      
        //Aggregate by Admin Unit
        const byCountyStatus = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                        county: "$county",
                        status: "$status"
                    },
                        totalCount: { $sum: 1 }, // Total count of documents in each county and status
                        totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                        totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"
                
                 }
            },
 
         
        ]);

        const bySubCountyStatus = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                        county: "$county",
                        subcounty: "$subcounty",
                        status: "$status"
                    },
                    totalCount: { $sum: 1 }, // Total count of documents in each county and status
                    totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                    totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"

                 }
            },
 
         
        ]);

        const bySubWardStatus = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                        county: "$county",
                        subcounty: "$subcounty",
                        ward: "$ward",
                        status: "$status"
                    },
                    totalCount: { $sum: 1 }, // Total count of documents in each county and status
                    totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                    totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"

                 }
            },
 
         
        ]);

        const bySubSettlementStatus = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                        county: "$county",
                        subcounty: "$subcounty",
                        ward: "$ward",
                        settlement: "$settlement",
                        status: "$status"
                    },
                    totalCount: { $sum: 1 }, // Total count of documents in each county and status
                    totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                    totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"

                 }
            },
 
         
        ]);

        //     Aggregate by Gender 
      const byGenderStatus = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                        gender: "$gender",
                        status: "$status"
                    },
                    totalCount: { $sum: 1 }, // Total count of documents in each county and status
                    totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                    totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"

                 }
            },
 
         
        ]);

        const byGenderOnly = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                        gender: "$gender",
                     },
                     totalCount: { $sum: 1 }, // Total count of documents in each county and status
                     totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                     totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"
 
                 }
            },
 
         
        ]);


        const byStatusOnly = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
            {
                $group: {
                    _id: {
                         status: "$status"
                    },
                    totalCount: { $sum: 1 }, // Total count of documents in each county and status
                    totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                    totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"
                 }
            },
        ]);

      
          // Convert date_reported string to Date type
  
        
        const byMonth = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
        
            // Project a new field 'month' with the month part of 'date_reported'
            // Convert date_reported string to Date type
                {
                    $addFields: {
                        date_reported: { $toDate: "$date_reported" } // Convert date_reported to Date type
                    }
                },
                
                // Project a new field 'month' with the month part of 'date_reported'
                {
                    $addFields: {
                        year: { $year: "$date_reported" } // Extract month from date_reported field
                    }
                },


                // Project a new field 'month' with the month part of 'date_reported'
                {
                    $addFields: {
                        month: { $month: "$date_reported" } // Extract month from date_reported field
                    }
                },

        
            // Group by month, status, and optionally other fields like county, settlement, etc.
            {
                $group: {
                    _id: {
                        year: "$year", // Group by year
                        month: "$month" 
                    },
                    totalCount: { $sum: 1 }, // Total count of documents for each month and status
                    totalGBV: { $sum: { $cond: { if: { $eq: ["$gbv", "Yes"] }, then: 1, else: 0 } } },
                    totalNonGBV: { $sum: { $cond: { if: { $ne: ["$gbv", "Yes"] }, then: 1, else: 0 } } } // Count of documents where gbv is not "Yes"
                }
            },
        
            // Optionally sort by month if needed
            { $sort: { "_id.month": 1 } }
        ]);
        
       
           
        const byMonthStatus = await Grievance.aggregate([
            { $match: filterQuery }, // Match documents based on the filter query
        
            // Project a new field 'month' with the month part of 'date_reported'
            // Convert date_reported string to Date type
                {
                    $addFields: {
                        date_reported: { $toDate: "$date_reported" } // Convert date_reported to Date type
                    }
                },
                
                // Project a new field 'month' with the month part of 'date_reported'
                {
                    $addFields: {
                        year: { $year: "$date_reported" } // Extract month from date_reported field
                    }
                },


                // Project a new field 'month' with the month part of 'date_reported'
                {
                    $addFields: {
                        month: { $month: "$date_reported" } // Extract month from date_reported field
                    }
                },

        
            // Group by month, status, and optionally other fields like county, settlement, etc.
            {
                $group: {
                    _id: {
                        year: "$year", // Group by year
                        month: "$month" ,
                        status: "$status" 
                    },
                    totalCount: { $sum: 1 }, // Total count of documents for each month and status
       }
            },
        
            // Optionally sort by month if needed
            { $sort: { "_id.month": 1 } }
        ]);

        const proportionStatus = await Grievance.aggregate([
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
        
        // Output the result for verification
        console.log(proportionStatus);
        

        const grievances = await Grievance.find({}).select('complaint');
        let grvs = grievances.map(grievance => grievance.complaint) 
          
       



        let result={}
         result.byGenderStatus =byGenderStatus
         result.bySubSettlementStatus =bySubSettlementStatus
         result.bySubWardStatus =bySubWardStatus
         result.bySubCountyStatus =bySubCountyStatus
         result.byCountyStatus =byCountyStatus
         result.byStatusOnly =byStatusOnly
         result.byGenderOnly =  byGenderOnly
         result.byMonth =  byMonth
         result.byMonthStatus =  byMonthStatus
         result.proportionStatus =  proportionStatus
         result.grievances =  grvs
 
         
         result.total =count

        
        

  

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
        // Close the MongoDB connection
      //  await mongoose.disconnect();
        console.log('Database disconnected...');
    }
});
