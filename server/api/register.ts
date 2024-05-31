 import bcrypt from 'bcryptjs';
import clientPromise from '../utils/mongodb';
 


export default defineEventHandler(async (req) => {
 
  let  reg_body = await readBody(req);
    try {
       //  console.log(req.body)
       const { username, password } = reg_body;

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const client = await clientPromise;
        const db = client.db('grm');
        const collection = db.collection('users');
    
        // Check if the username already exists
        reg_body.password = hashedPassword
        console.log(reg_body)


        const existingUser = await collection.findOne({ username });
        if (existingUser) {
         // return res.status(400).json({ error: 'Username already exists' });
          return {
            message: 'Username already exists' ,
          };
        }
    

        // Insert the user into the database
        await collection.insertOne(reg_body);
    
       // return res.status(201).json({ message: 'User registered successfully' });
        return {
            message: 'User registered successfully' ,
            code :'0000'
          };
      } catch (error) {
        console.error('Error registering user:', error);
       // return res.status(500).json({ error: 'Internal server error' });
        return {
            error: 'Internal server error' ,
          };
      }
  });