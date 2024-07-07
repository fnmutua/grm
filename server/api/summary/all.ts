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

        ///-----------------------------------------------------------------------------//
        ///// ---------------Get Summaries for ALL-------------------------------------- 
        ///-----------------------------------------------------------------------------//
        console.log('filterQuery>>>><<<<',filterQuery)

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
        
        filterQuery.status = 'Resolved';

     
        const  averagePeriod = await Grievance.aggregate([
            // Match documents where status is 'Resolved'
            { $match: filterQuery }, // Match documents based on the filter query

            // {
            //   $match: {
            //     status: "Resolved"
            //   }
            // },
            // Unwind the timeline array
            { $unwind: "$timeline" },
            // Project to parse and use the content of timeline
            {
              $addFields: {
                timelineObject: {
                  $function: {
                    body: function(item) {
                      try {
                        return JSON.parse(item);
                      } catch (e) {
                        return null; // Return null if parsing fails
                      }
                    },
                    args: ["$timeline"],
                    lang: "js"
                  }
                }
              }
            },
            // Match timelineObject entries with status 'Open' or 'Resolved'
            {
              $match: {
                $or: [
                  { "timelineObject.status": "Open" },
                  { "timelineObject.status": "Resolved" }
                ]
              }
            },
            // Group by _id (or any suitable grouping identifier) to calculate differences
            {
              $group: {
                _id: "$_id", // Group by some identifier, e.g., document _id
                openDate: {
                  $max: {
                    $cond: {
                      if: { $eq: ["$timelineObject.status", "Open"] },
                      then:{ $toDate:"$timelineObject.date"} , // Assuming date is a field in timelineObject
                      else: null
                    }
                  }
                },
                resolvedDate: {
                  $max: {
                    $cond: {
                      if: { $eq: ["$timelineObject.status", "Resolved"] },
                      then:  {$toDate:"$timelineObject.date"}, // Assuming date is a field in timelineObject
                      else: null
                    }
                  }
                }
              }
            },
            
            // Project to calculate the difference between resolvedDate and openDate
            {
              $project: {
                _id: 0,
                openDate: 1,
                resolvedDate: 1,
                period: { $divide: [{ $subtract: ["$resolvedDate", "$openDate"] }, 1000 * 60 * 60 * 24] } // Difference in days
              }
            },

            // Calculate the average period across all documents
            {
                $group: {
                _id: null, // Group all documents together
                averagePeriod: { $avg: "$period" } // Calculate the average of the 'period' field
                }
            },
            // Optionally project to reshape the output if needed
            {
                $project: {
                _id: 0,
                averagePeriod: 1
                }
            }
          ]);

           
          
          console.log(averagePeriod);
          
          
        
        // Console log after unwinding the timeline array
        console.log("Documents after unwinding:");
        console.log(JSON.stringify(averagePeriod, null, 2));
  

        
        // Output the result for verification
        //console.log(proportionStatus);
        
  


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
         result.averageResolutionPeriod = averagePeriod?.[0]?.averagePeriod ?? 0;
         result.total =count
        //  result.grievances =  grvs
        // Append for GBVs

  
         
     

        
        

  

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
