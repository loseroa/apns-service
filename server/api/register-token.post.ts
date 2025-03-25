import { defineEventHandler, readBody, createError } from 'h3'

interface TokenRegistrationRequest {
  token: string;
  userId: string;
  deviceType: 'ios' | 'android';
  appBundle?: string;
}

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody<TokenRegistrationRequest>(event)
    
    if (!body.token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Device token is required'
      })
    }
    
    if (!body.userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }
    
    if (!body.deviceType || !['ios', 'android'].includes(body.deviceType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid device type (ios or android) is required'
      })
    }
    
    // Store the token in database (implement this according to your storage solution)
    // This is a placeholder for the actual implementation
    const result = await registertoken(body)
    
    return {
      success: true,
      message: 'Device token registered successfully',
      data: {
        token: body.token,
        userId: body.userId,
        deviceType: body.deviceType
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to register device token'
    })
  }
})

async function registertoken(data: TokenRegistrationRequest) {

  const db = useDatabase("mydb");

  //create table if not exists
    await db.sql`CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY,
        userId TEXT,
        appBundle TEXT
    )`;
    //insert new token
    const result = await db.sql`INSERT INTO tokens (token, userId, appBundle) VALUES (${data.token}, ${data.userId}, ${data.deviceType}, ${data.appBundle})`;
    console.log(result);
    
  return { success: true }
}
