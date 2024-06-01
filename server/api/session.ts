import jwt from 'jsonwebtoken';
import { createError, eventHandler, getRequestHeader, H3Event } from 'h3'

const SECRET = 'maluini'; // Ideally, store this in an environment variable

// export default defineEventHandler(async (req) => {
//     // Extract the token from the request headers
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return {
//             error: 'No token provided',
//         };
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, secret);

//         // Token is valid, return the decoded payload
//         return {
//             message: 'Token is valid',
//             decoded,
//         };
//     } catch (err) {
//         // Token verification failed
//         console.error('Token verification failed:', err.message);
//         return {
//             error: 'Token is invalid or expired',
//         };
//     }
// });



const TOKEN_TYPE = 'Bearer'

const extractToken = (authHeaderValue: string) => {
  const [, token] = authHeaderValue.split(`${TOKEN_TYPE} `)
  return token
}

const ensureAuth = (event: H3Event) => {
  const authHeaderValue = getRequestHeader(event, 'authorization')
  if (typeof authHeaderValue === 'undefined') {
    throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })
  }

  const extractedToken = extractToken(authHeaderValue)
  try {
    return jwt.verify(extractedToken, SECRET)
  } catch (error) {
    console.error('Login failed. Here\'s the raw error:', error)
    throw createError({ statusCode: 403, statusMessage: 'You must be logged in to use this endpoint' })
  }
}

export default eventHandler((event) => {
  const user = ensureAuth(event)
  return user
})