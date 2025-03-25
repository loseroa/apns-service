import { TokenRegisterRequest } from '~/server/types';

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody<TokenRegisterRequest>(event);

    console.log('Registering token:', body);
    
    // Validate required fields
    if (!body.token) {
      return createError({
        statusCode: 400,
        statusMessage: 'Device token is required'
      });
    }
    
    if (!body.userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    if (!body.appBundle) {
      return createError({
        statusCode: 400,
        statusMessage: 'App bundle is required'
      });
    }
    
    // Register the token in the database
    const success = await registerToken(body.token, body.userId, body.appBundle);
    
    if (!success) {
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to register token'
      });
    }
    
    console.log(`Registered token for user ${body.userId}: ${body.token}`);
    
    // Return success response
    return {
      success: true,
      message: 'Token registered successfully'
    };
  } catch (error) {
    console.error('Error registering token:', error);
    
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to register token'
    });
  }
})

async function registerToken(token: string, userId: string, appBundle: string): Promise<boolean> {
    try {
        //connect to db
        const db = useDatabase('mydb');
        //create table if not exists
        await db.sql`CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY, 
            userId TEXT,
            appBundle TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        //drop the table
        // await db.sql`DROP TABLE IF EXISTS tokens`;

        //insert token
        await db.sql`INSERT INTO tokens (token, userId, appBundle, createdAt) 
                     VALUES (${token}, ${userId}, ${appBundle}, CURRENT_TIMESTAMP)`;
        
        return true; // Return true if the operations completed successfully
    } catch (error) {
        console.error('Database error when registering token:', error);
        return false; // Return false if any error occurred
    }
}