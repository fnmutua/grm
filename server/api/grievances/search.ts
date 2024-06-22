import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";

// Get grievance status by keyword with pagination
async function getGrievanceStatusByKeyword(keyword, status, page, pageCount) {
  try {
    // Create a regular expression for the keyword, case insensitive
    const regex = new RegExp(keyword, 'i');
    
    // Calculate skip value for pagination
    const skip = (page - 1) * pageCount;

    // Find the grievances by searching multiple fields for the keyword and matching the status
    const grievances = await Grievance.find({
      $and: [
        { status: status },
        { $or: [
            { code: regex },
            { complaint: regex },
            { resolution: regex },
            { county: regex },
            { subcounty: regex },
            { name: regex },
            { gender: regex },
            { phone: regex },
            { acceptance: regex },
            { settlement: regex }
          ]
        }
      ]
    }).skip(skip).limit(pageCount).exec();

    // Fetch total count of grievances that match the query
    const totalCount = await Grievance.countDocuments({
      $and: [
        { status: status },
        { $or: [
            { code: regex },
            { complaint: regex },
            { resolution: regex },
            { county: regex },
            { subcounty: regex },
            { name: regex },
            { gender: regex },
            { phone: regex },
            { acceptance: regex },
            { settlement: regex }
          ]
        }
      ]
    });

    if (!grievances.length) {
      return { grievances: 'Not found', totalCount: 0 };
    } else {
      // Return the grievance objects if found along with the total count
      return { grievances, totalCount };
    }

  } catch (error) {
    console.error(`Error retrieving grievance status: ${error.message}`);
    return { grievances: 'Error retrieving status', totalCount: 0 };
    throw error;
  }
}

export default defineEventHandler(async (req) => {
  const { keyword, status, page , pageCount } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  await mongoose.connect(mongoString, { dbName: 'grm' });
  console.log('getGrievanceStatusByKeyword ------------>', keyword, status,page , pageCount );

  try {
    const { grievances, totalCount } = await getGrievanceStatusByKeyword(keyword, status, page, pageCount);
    console.log('found', grievances.length);

    if (grievances !== 'Not found' && grievances !== 'Error retrieving status') {
      return {
        success: true,
        data: grievances,
        total: totalCount,
        message: "Grievances found",
        code: '0000'
      };
    } else {
      return {
        success: false,
        message: grievances === 'Not found' ? "Grievances not found" : "Error retrieving status",
        code: '9999'
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "Internal server error",
      code: '9999'
    };
  } finally {
    // Close the MongoDB connection if necessary
    // await mongoose.disconnect();
    // console.log('Database disconnected...');
  }
});
