import mongoose from 'mongoose';

// Define a Mongoose schema for grievances
const grievanceSchema = new mongoose.Schema({
    // Define the schema fields as needed
    // For example:
    title: String,
    description: String,
    status: String
});

// Define the Mongoose model for grievances
const Grievance = mongoose.model('Grievance', grievanceSchema);


export default defineEventHandler(async (req) => {
    const { status } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;
    console.log('status',status)

    try {
        await mongoose.connect(mongoString);

        console.log('Database connected...');

        // Find all grievances
        const data = await Grievance.find({status:status});
        //console.log(data);

        if (data.length === 0) {
            return {
                message: 'Grievances not found',
                data: [],
                code: '0000'
            };
        } else {
            return {
                message: 'Grievances found',
                data: data,
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
      //  await mongoose.disconnect();
       // console.log('Database disconnected...');
    }
});

