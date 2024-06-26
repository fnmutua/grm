import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const secret = 'maluini'; // Ideally, store this in an environment variable

import clientPromise from '../utils/mongodb';

export default defineEventHandler(async (req) => {
    const { username, password } = await readBody(req);
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
        
        console.log(user.roles)
        const isAdmin =  user.roles.includes("ADMIN");
        const isUser =  user.roles.includes("USER");
        const isSettGRC =  user.roles.includes("SETTLEMENT_GRC");
        const isCountyGRC =  user.roles.includes("COUNTY_GRC");
        const isNationalGRC =  user.roles.includes("NATIONAL_GRC");
        const isGBV =  user.roles.includes("GBV");

        const jwt_obj = {
            id: user._id, 
            username: user.username, 
            name: user.name, 
            roles: user.roles,
            isAdmin: isAdmin,
            isUser: isUser,
            isSettGRC: isSettGRC,
            isCountyGRC: isCountyGRC,
            isNationalGRC: isNationalGRC,
            isGBV: isGBV
        };

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return {
                message: 'Incorrect password',
                code: '9999'
            };

        } else {
           // const access_token = jwt.sign(jwt_obj, secret, { expiresIn: '1h' });
            const access_token = jwt.sign(jwt_obj, secret, { expiresIn: '1m' }); // Set expiration to 1 minute

            console.log('access_token', access_token);

            return {
                token: access_token
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

