import mongoose from 'mongoose';
import County from "./../../../models/county";
import Subcounty from "./../../../models/subcounty";
import Ward from "./../../../models/ward";
import Settlement from "./../../../models/settlement";

export default defineEventHandler(async (req) => {
  const { model, filterKeys, filterValues } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;
  try {
    await mongoose.connect(mongoString, { dbName: 'grm' });
    console.log('Database connected....FIlter Admin..', model);

     let AdminUnit;

    if (model === 'county') {
      AdminUnit = County;
    } else if (model === 'subcounty') {
      AdminUnit = Subcounty;
    } else if (model === 'ward') {
      AdminUnit = Ward;
    } else if (model === 'settlement') {
      AdminUnit = Settlement;
    }

    // Construct the filter query dynamically
    let filterQuery = {};
    if (Array.isArray(filterKeys) && Array.isArray(filterValues) && filterKeys.length === filterValues.length) {
      filterKeys.forEach((key, index) => {
        if (filterValues[index] !== null && filterValues[index] !== undefined) {
          filterQuery[key] = filterValues[index];
        }
      });
    }

    console.log('Filtred filterQuery....',filterQuery)

    // Fetch data with optional filters
    const data = await AdminUnit.find(filterQuery).select('-geometry');

    console.log('Filtred Adminuits....',data)

    if (data.length === 0) {
      return {
        message: model + ' not found',
        data: [],
        code: '0000'
      };
    } else {
      // Fetch total count of documents matching the filter
      const totalCount = await AdminUnit.countDocuments(filterQuery);

      return {
        message: model + ' found',
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
