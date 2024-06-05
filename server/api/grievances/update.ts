import mongoose from 'mongoose';
import Grievance from "../../models/grievance";
 

// Define the Mongoose model for grievances
//const Grievance = mongoose.model('Grievance', grievanceSchema);

  
export default defineEventHandler(async (req) => {
  const { ids, field, field_value,resolution } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  await mongoose.connect(mongoString, { dbName: 'grm' });
  console.log('Database verify connected...');

  try {
    // Check if ids is an array
    if (!Array.isArray(ids)) {
      throw new Error('ids should be an array');
    }

    console.log('ids',ids)
    console.log('resolution',resolution)

    const updatedGrievances = [];

    // Loop through each ID and update the corresponding grievance
    for (const id of ids) {

      const updateData = {
        [field]: field_value,
        resolution: resolution ? resolution : 'Pending'
      };

            
      const grievance = await Grievance.findByIdAndUpdate(
        id,
        updateData,
        { new: true, useFindAndModify: false }
      ).exec();

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
        message: 'Grievances updated',
        code: '0000'
      };
    } else {
      // If no grievances were found or updated, return failure
      return {
        success: false,
        message: 'No grievances were updated',
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

