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
    const { id } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;
    await mongoose.connect(mongoString,{dbName:'grm' });
        console.log('Database  verify connected...');
  
        try {
     
          const  grievance = await Grievance.findById(id).select('code complaint status resolution county subcounty ward settlement history createdAt ').exec();
       
           // If grievance found, return success
           if (grievance ) {
            // return res.status(200).json({ success: true, message: "Grievance retrieved", data: grievance });
             return {
              success: true,
              data: grievance,
              message: "Grievance found" ,
              code: '0000'
            };
           } else {
             // If grievance not found, return failure
            // return res.status(404).json({ success: false, message: "Grievance  not found" });

             return {
              success: false,
               message: "Grievance not found" ,
              code: '9999'
            };

           }
         } catch (error) {
           console.error("Error:", error);
          // return res.status(500).json({ success: false, message: "Internal server error" });
           
           return {
            success: false,
             message: "Internal server error" ,
            code: '9999'
          };

         }

     
});

