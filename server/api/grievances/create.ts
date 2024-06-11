import mongoose from 'mongoose';
import Grievance from "./../../models/grievance";
import Document from "./../../models/document";
import axios from 'axios';
import fs from 'fs';

 
import {writeFile} from 'fs/promises'
 
 
const directoryPath = './uploads'


// Check if the directory exists
if (!fs.existsSync(directoryPath)) {
    // If it doesn't exist, create the directory
    fs.mkdirSync(directoryPath);
  
    console.log(`Directory '${directoryPath}' created.`);
  } else {
    console.log(`Directory '${directoryPath}' already exists.`);
  }

  
// generate grievance
async function generateGrievanceReferenceNumber() {
    const currentYear = new Date().getFullYear();
  
    // Query MongoDB to find the last grievance number
    let lastGrievanceNumber = await Grievance.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    ).exec();

 

  
    let newGrievanceNumber;
  
 
  
    if (
      lastGrievanceNumber &&
      lastGrievanceNumber.code &&
      lastGrievanceNumber.code.split("-").length === 3
    ) {
      const lastYear = lastGrievanceNumber.code.split("-")[1];
      const lastCount = parseInt(lastGrievanceNumber.code.split("-")[2]);
  
      if (parseInt(lastYear) === currentYear) {
        // Increment the count if the year matches the current year
        const newCount = lastCount + 1;
        newGrievanceNumber = `GRM-${currentYear}-${pad(newCount, 3)}`;
      } else {
        // Start count from 001 if the year is different
        newGrievanceNumber = `GRM-${currentYear}-001`;
      }
    } else {
      // If no grievance numbers exist yet, start from 001 for the current year
      newGrievanceNumber = `GRM-${currentYear}-001`;
    }
  
    return newGrievanceNumber;
  }
  
  // Helper function to pad numbers with leading zeros
  function pad(number, length) {
    let str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }
  
  async function sendSMS(sms_obj) {
    // Send OTP via Leopard (not implemented in this code snippet)
    const url = "https://quicksms.advantasms.com/api/services/sendotp/";
  
    let msg =
      "Dear " +
      sms_obj.name +
      ", your grievance has been registered. Your reference is : " +
      sms_obj.code + ". You can monitor the status of your report here -> https://grm.ags.co.ke/status/"+sms_obj.id;
      
  
      //http://localhost:3000/status/6652e0486b49fb5075942951
  
  
    const requestData = {
      apikey: "25979d894f97b2a8df210fe0c20d68c5",
      partnerID: "10322",
      shortcode: "AGS",
      message: msg,
      mobile: sms_obj.phone,
    };
  
    axios
      .post(url, requestData)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
 
  
  export default defineEventHandler(async (event) => {

    
    try {
      // Read multipart form data
      

      const mongoString = process.env.MONGODB_URI;

      await mongoose.connect(mongoString,{dbName:'grm' });
      console.log('Database connected...');


      const data = await readMultipartFormData(event);
      console.log('data',data)
 
      const fields = {};
      const files = [];
 
      // Separate fields and files
      data.forEach(item => {
        if (item.filename) {
          // It's a file
          files.push({
            name: item.name,
            filename: item.filename,
            type: item.type,
            data: item.data
          });
        } else {
          // It's a field
          fields[item.name] = item.data.toString('utf-8');
        }
      });
 
      // Log the extracted fields and files
      console.log('Fields:', fields);
      console.log('Files:', files);
 
      const grv_data = new Grievance({
        name: fields.name,
        county: fields.county,
        subcounty: fields.subcounty,
        ward: fields.ward,
        settlement: fields.settlement,
        settlement_id: fields.settlement_id,
        complaint: fields.complaint,
        phone: fields.phone,
        status: fields.status ? fields.status : 'Open',
        resolution: fields.resolution ? fields.resolution : 'Pending',
        acceptance: fields.acceptance, // default
      });
 
      const code = await generateGrievanceReferenceNumber();
      grv_data.code = code;
 
      // Save the data to the database
      const result = await grv_data.save();
      grv_data.id = result._id; 

      // recall to reactivay
      sendSMS(grv_data);
 
     
            // Iterate through the files and save them to the database or perform any desired operations
            for (const file of files) {
                console.log('Uploading file:', file);
 
                  const path = './uploads/'+ file.filename
                  await writeFile(path, file.data)
 
                // Assuming you have a model named Document to save the file details
                const documentData = new Document({
                fileName: file.filename,
                grievanceCode: code,
                filePath: file.filename // Assuming the file path is the same as the filename
                });

                const savedDocument = await documentData.save();
                console.log('Document saved:', savedDocument);
            }


      
 
      return {
        message: 'Submission Successful',
        data: result,
        success: true,
        code: '0000'
      };
    } catch (error) {
      console.error('Error during submission:', error);
      return {
        message: 'Submission Failed',
        success: false,
        code: '0001' 
      };
    }
 });
 