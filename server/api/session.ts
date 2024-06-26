import jwt from 'jsonwebtoken';
import { createError, eventHandler, getRequestHeader, H3Event } from 'h3'

const SECRET = 'maluini'; // Ideally, store this in an environment variable
 

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
    navigateTo('/login');
    throw createError({ statusCode: 403, statusMessage: 'You must be logged in to use this endpoint' })
  }
}

export default eventHandler((event) => {
  const user = ensureAuth(event)
  return user
})