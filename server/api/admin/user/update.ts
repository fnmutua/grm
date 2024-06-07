import mongoose from 'mongoose';
import User from "../../../models/user";
 

// Define the Mongoose model for grievances
//const Grievance = mongoose.model('Grievance', grievanceSchema);

  
export default defineEventHandler(async (req) => {
  const {_id, username, name, phone,gender,county,subcounty,ward,settlement,settlement_id } = await readBody(req);

 const obj=await readBody(req);


  const mongoString = process.env.MONGODB_URI;
  await mongoose.connect(mongoString, { dbName: 'grm' });
  console.log('Database user update connected...');

  try {
  

    console.log('ids',_id) 
            
      const user = await User.findByIdAndUpdate(
        _id,
        obj,
        { new: true, useFindAndModify: false }
      ).exec();
 

    // If any grievances were updated, return success
    if (user) {
      return {
        success: true,
        data: user,
        message: 'User updated',
        code: '0000'
      };
    } else {
      // If no grievances were found or updated, return failure
      return {
        success: false,
        message: 'No User was updated',
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

