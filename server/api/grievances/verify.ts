import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";
 

// Define the Mongoose model for grievances
//const Grievance = mongoose.model('Grievance', grievanceSchema);

  // get grievance status
  async function getGrievanceStatusByCodePhone(code, phone) {
    try {
      // Find the grievance by its code and phone number
      const grievance = await Grievance.findOne({ code: code, phone: phone }).exec();
  
      if (!grievance) {
        return 'Not found';
    } else {
        // Return the grievance object if found
        return grievance;
    }
  

    } catch (error) {
      console.error(`Error retrieving grievance status: ${error.message}`);
      return "Error retrieving status";
      throw error;
    }
  }

export default defineEventHandler(async (req) => {
    const { reference, phone } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;


  //  const { reference, phone } = req.body;
    console.log("Reference:", reference);
    console.log("Phone:", phone);

    await mongoose.connect(mongoString,{dbName:'grm' });
        console.log('Database  verify connected...');
  
    try {
      // Check grievance status by code and phone number
      let grievance = await getGrievanceStatusByCodePhone(reference, phone);

      console.log('grievance',grievance)
  
      // If grievance found, return success
      if (grievance !== "Not found") {
      //  return res.status(200).json({ success: true, message: "Grievance found", grievance: grievance });
        return {
            success: true,
            grievance: grievance,
            message: "Grievance found" ,
            code: '0000'
        };
      } else {
        // If grievance not found, return failure
       // return res.status(404).json({ success: false, message: "Grievance not found" });
        return {
            success: false,
            message: "Grievance not found" ,
            code: '9999'
        };
      }
    } catch (error) {
      console.error("Error:", error);
      //return res.status(500).json({ success: false, message: "Internal server error" });
      return {
        success: false,
        message: "Internal server error" ,
        code: '9999'
    };
    }


    
    // try {
    //     await mongoose.connect(mongoString,{dbName:'grm' });
    //     console.log('Database connected...');

    //     // Calculate skip value for pagination
    //     const skip = (page - 1) * pageCount;

    //     // Find grievances based on status and include pagination
    //     const data = await Grievance.find({ status: status }).skip(skip).limit(pageCount);
 
    //     if (data.length === 0) {
    //         return {
    //             message: 'Grievances not found',
    //             data: [],
    //             code: '0000'
    //         };
    //     } else {
    //         // Fetch total count of grievances
    //         const totalCount = await Grievance.countDocuments({ status: status });

    //         return {
    //             message: 'Grievances found',
    //             data: data,
    //             total: totalCount, // Return total count for pagination
    //             code: '0000'
    //         };
    //     }
    // } catch (error) {
    //     console.error('Error during fetch:', error);
    //     return {
    //         message: 'Internal server error',
    //         code: '9999'
    //     };
    // } finally {
    //     // Close the MongoDB connection
    //     // await mongoose.disconnect();
    //     // console.log('Database disconnected...');
    // }
});

