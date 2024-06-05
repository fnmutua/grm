import mongoose from 'mongoose';
import Grievance from "../../models/grievance";
import axios from 'axios';


// Define the Mongoose model for grievances
//const Grievance = mongoose.model('Grievance', grievanceSchema);

async function sendSMS(sms_obj) {
  // Send OTP via Leopard (not implemented in this code snippet)
  const url = "https://quicksms.advantasms.com/api/services/sendotp/";

 // console.log(sms_obj)

  let msg =
    "Dear " +
    sms_obj.name + ', ' +
    sms_obj.message + 
    " You can monitor the status of your report here -> https://grm.ags.co.ke/status/"+sms_obj.id;
    
  const requestData = {
    apikey: "25979d894f97b2a8df210fe0c20d68c5",
    partnerID: "10322",
    shortcode: "AGS",
    message: msg,
    mobile: sms_obj.phone,
  };

  console.log(requestData)

  //***************Remember to actiate-------------- */
  //--------------------------------------------------
  // axios
  //   .post(url, requestData)
  //   .then((response) => {
  //     console.log("Response:", response.data);
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });


}

  
export default defineEventHandler(async (req) => {
  const { ids, message } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  await mongoose.connect(mongoString, { dbName: 'grm' });
  console.log('Database verify connected...');

  try {
    // Check if ids is an array
    if (!Array.isArray(ids)) {
      throw new Error('ids should be an array');
    }

    console.log('ids',ids)

    const updatedGrievances = [];

    // Loop through each ID and update the corresponding grievance
    for (const id of ids) {
     

      let  grievance = await Grievance.findById(id).exec();
      grievance.message =message
      console.log(grievance)

      await sendSMS(grievance)


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

