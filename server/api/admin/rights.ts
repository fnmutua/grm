import mongoose from 'mongoose';
import User from "../../models/user";
 
export default defineEventHandler(async (req) => {
  const { ids, roles,  } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  await mongoose.connect(mongoString, { dbName: 'grm' });
  console.log('Database roles  connected...');

  try {
    // Check if ids is an array
    if (!Array.isArray(ids) || !Array.isArray(roles)) {
      throw new Error('ids/roles should be an array');
    }


    console.log('ids',ids)
    console.log('roles',roles)

    const updatedUsers = [];

    // Loop through each ID and update the corresponding grievance
    for (const id of ids) {

      const updateData = {
        roles: roles,
       };

            
      const userUpdated = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, useFindAndModify: false }
      ).exec();

      if (userUpdated) {
        updatedUsers.push(userUpdated);
      } else {
        console.log(`User not found for ID: ${id}`);
      }
    }

    // If any grievances were updated, return success
    if (updatedUsers.length > 0) {
      return {
        success: true,
        data: updatedUsers,
        message: 'Users updated',
        code: '0000'
      };
    } else {
      // If no grievances were found or updated, return failure
      return {
        success: false,
        message: 'No users were updated',
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

