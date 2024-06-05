import mongoose from 'mongoose';
import Grievance from "../../models/grievance";
 

// Define the Mongoose model for grievances
//const Grievance = mongoose.model('Grievance', grievanceSchema);

  
export default defineEventHandler(async (req) => {
  const { ids, field, field_value } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  await mongoose.connect(mongoString, { dbName: 'grm' });
  console.log('Database deleted connected...');

  try {
    // Check if ids is an array
    if (!Array.isArray(ids)) {
      throw new Error('ids should be an array');
    }

    console.log('ids',ids)

    const updatedGrievances = [];

    // Loop through each ID and update the corresponding grievance
    for (const id of ids) {
      const grievance = await Grievance.findByIdAndDelete(id).exec();
      if (grievance) {
        updatedGrievances.push(grievance);
      } else {
        console.log(`Grievance not found for ID: ${id}`);
      }
    }

    // If any grievances were updated, return success
    if (updatedGrievances.length > 0) {
      return {
        success: true,
        data: updatedGrievances,
        message: 'Grievances deleted',
        code: '0000'
      };
    } else {
      // If no grievances were found or updated, return failure
      return {
        success: false,
        message: 'No grievances were deleted',
        code: '9999'
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: 'Internal server error',
      code: '9999'
    };
  }
});

