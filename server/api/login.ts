import bcrypt from 'bcryptjs';
import clientPromise from '../utils/mongodb';

export default defineEventHandler(async (req) => {
    const { username, password } = await readBody(req);
    console.log(username, password)
    try {
        const client = await clientPromise;
        const db = client.db('ussd');
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

            // Login successful
            return {
                message: 'Login successful',
                code: '0000'
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
