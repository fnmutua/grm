 import bcrypt from 'bcryptjs';
import clientPromise from '../utils/mongodb';
 


export default defineEventHandler(async (req) => {
 
    const {  username, password } = await readBody(req);
    console.log(username, password)
    try {
     //   const { username, password } = req.body;
      //  console.log(req.body)
    
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const client = await clientPromise;
        const db = client.db('grm');
        const collection = db.collection('users');
    
        // Check if the username already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
         // return res.status(400).json({ error: 'Username already exists' });
          return {
            message: 'Username already exists' ,
          };
        }
    
        // Insert the user into the database
        await collection.insertOne({ username, password: hashedPassword });
    
       // return res.status(201).json({ message: 'User registered successfully' });
        return {
            message: 'User registered successfully' ,
          };
      } catch (error) {
        console.error('Error registering user:', error);
       // return res.status(500).json({ error: 'Internal server error' });
        return {
            error: 'Internal server error' ,
          };
      }
  });