import mongoose from 'mongoose';
import County from "./../../../models/county";
import Subcounty from "./../../../models/subcounty";
import Ward from "./../../../models/ward";
import Settlement from "./../../../models/settlement";
 
 

export default defineEventHandler(async (req) => {
  const { model, page, pageCount } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  try {
        await mongoose.connect(mongoString,{dbName:'grm' });
        console.log('Database connected...',model );

         const skip = (page - 1) * pageCount;
            let AdminUnit
         if(model=='county') {
            AdminUnit = County
         } 
         else if(model=='subcounty') {
            AdminUnit = Subcounty
         }
         else if(model=='ward') {
            AdminUnit = Ward
         }
            
         else if(model=='settlement') {
            AdminUnit = Settlement
         }
            



        // const data = await AdminUnit.find().skip(skip).limit(pageCount) ;
         const data = await AdminUnit.find().select('-geometry') ;

       // console.log('users',data)
 
        if (data.length === 0) {
            return {
                message: model + ' not found',
                data: [],
                code: '0000'
            };
        } else {
            // Fetch total count of grievances
            const totalCount = await AdminUnit.countDocuments();

            return {
                message:  model + ' found',
                data: data,
                total: totalCount, // Return total count for pagination
                code: '0000'
            };
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return {
            message: 'Internal server error',
            code: '9999'
        };
    } finally {
        // Close the MongoDB connection
        // await mongoose.disconnect();
        // console.log('Database disconnected...');
    }
});

