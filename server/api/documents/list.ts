import mongoose from 'mongoose';
import Document from "./../../models/document";

 

// Define the Mongoose model for grievances
// const Document = mongoose.model('Document', grievanceSchema);

export default defineEventHandler(async (req) => {
    const {  grievance_ids, page, pageCount } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;
  
    try {
      await mongoose.connect(mongoString, { dbName: 'grm' });
      console.log('Database connected...');
  
      // Calculate skip value for pagination
      const skip = (page - 1) * pageCount;
      let qry_obj = {};
  
      if (Array.isArray(grievance_ids) && grievance_ids.length > 0) {
        qry_obj.grievanceCode = { $in: grievance_ids };
      }
  
      console.log(qry_obj);
  
      // Find grievances based on status and include pagination, sorted by createdAt in descending order
      const data = await Document.find(qry_obj).sort({ createdAt: -1 }).skip(skip).limit(pageCount).select('-__v -UpdatedAt -FilePath');
  
      if (data.length === 0) {
        return {
          message: 'Documents not found',
          data: [],
          code: '0000'
        };
      } else {
        // Fetch total count of grievances
        const totalCount = await Document.countDocuments({ grievanceCode: grievance_ids });
  
        return {
          message: 'Documents found',
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
  