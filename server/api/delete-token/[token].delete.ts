
export default defineEventHandler(async (event) => {
    try {
      //get the param token from the request
      const token = getRouterParam(event, 'token');
      console.log('Deleting token:', token);
      
      // Get database connection
      const db = useDatabase("mydb")
      if (!db) {
        throw createError({
          statusCode: 500,
          message: 'Database connection not available'
        })
      }
  
      // Delete token from database
  
      const result = await db.sql`
        DELETE FROM tokens
        WHERE token = ${token}`
  
      return {
        success: true,
        message: result
      }
    } catch (error) {
  
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    }
  })
  