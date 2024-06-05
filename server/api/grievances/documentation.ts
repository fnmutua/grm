import mongoose from 'mongoose';
import Document from "../../models/document";
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
 
 
 
 
 export default defineEventHandler(async (event) => {
  try {
    // Connect to MongoDB
    const mongoString = process.env.MONGODB_URI;
    await mongoose.connect(mongoString, { dbName: 'grm' });
    console.log('Database Document upload connected...');

    // Read multipart form data
    const data = await readMultipartFormData(event);
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
    console.log('fields.grievanceCode', fields.grievanceCode);

    // Iterate through the files and check for duplicates
    for (const file of files) {
      console.log('Processing file:', file);

      // Check for duplicate document by filename or grievance code
      const duplicateDocument = await Document.findOne({
        fileName: file.filename,
        grievanceCode: fields.grievanceCode
      });
      
      if (duplicateDocument) {
        console.log('Duplicate document found:', duplicateDocument);
        // Handle the duplicate case (e.g., skip saving, return error response, etc.)
        return {
          message: 'Duplicate document found',
          success: false,
          code: '0002'
        };
      }

      // No duplicate found, proceed with saving the file
      const path = './uploads/' + file.filename;
      await writeFile(path, file.data);

      // Assuming you have a model named Document to save the file details
      const documentData = new Document({
        fileName: file.filename,
        grievanceCode: fields.grievanceCode,
        filePath: file.filename // Assuming the file path is the same as the filename
      });

      const savedDocument = await documentData.save();
      console.log('Document saved:', savedDocument);
    }

    return {
      message: 'Upload Successful',
      success: true,
      code: '0000'
    };
  } catch (error) {
    console.error('Error during submission:', error);
    return {
      message: 'Upload Failed',
      success: false,
      code: '0001'
    };
  }
});
