import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const secret = 'maluini'; // Ideally, store this in an environment variable

import clientPromise from '../utils/mongodb';

export default defineEventHandler(async (req) => {
    const { username, password } = await readBody(req);
    const body = await readBody(req);
    console.log('-----',body)
    try {
        const client = await clientPromise;
        const db = client.db('grm');
        const collection = db.collection('users');

        // Find the user by username
        const user = await collection.findOne({ username });
        if (!user) {
            return {
                error: 'User not found',
            };
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)
        if (!passwordMatch) {
            return {
                message: 'Incorrect password',
                code: '9999'
            };
        } else {
            const access_token = jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '1h' });
            console.log('access_token',access_token)

            // Login successful
            return {
                //message: 'Login successful',
               // code: '0000',
               token :  access_token
                // token: {
                //     access_token
                //   },
                  
            };
        }

     
    } catch (error) {
        console.error('Error during login:', error);
        return {
            message: 'Internal server error',
            code: '9999'
        };
    }
});
