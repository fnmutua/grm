import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

import User from "./../../models/user";

// Define the Mongoose model for grievances

export default defineEventHandler(async (req) => {
  const {
    name,
    username,
    gender,
    phone,
    password,
    county,
    subcounty,
    ward,
    settlement,
    settlement_id,
    roles,
  } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;

  await mongoose.connect(mongoString,{dbName:'grm' });
  console.log('Database @User connected...');

  try {
    // Check for duplicate document by filename or grievance code
    const duplicateUser = await User.findOne({
      username: username,
      phone: phone,
    });

    if (duplicateUser) {
      // Handle the duplicate case (e.g., skip saving, return error response, etc.)
      return {
        message: "An account with the same credentials exists",
        success: false,
        code: "0002",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name: name,
      username: username,
      gender: gender,
      phone: phone,
      password: hashedPassword,
      county: county,
      subcounty: subcounty,
      ward: ward,
      settlement: settlement,
      settlement_id: settlement_id,
      roles: roles,
    });

    const SavedUserData = await userData.save();
    const selectedFieldsUser = await User.findById(SavedUserData._id).select('username phone name').exec();


    // return res.status(201).json({ message: 'User registered successfully' });
    return {
      message: "User registered successfully",
       data: selectedFieldsUser,
      code: "0000",
    };
  } catch (error) {
    console.error("Error registering user:", error);
    // return res.status(500).json({ error: 'Internal server error' });
    return {
      message: "Internal server error",
      code: "0000",
    };
  }
});
