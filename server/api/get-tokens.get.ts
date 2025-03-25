
export default defineEventHandler(async (event) => {
  try {
     //connect to db
    const db = useDatabase('mydb');
    // Query all tokens from the database and parse into interface TokenRegisterRequest
    const tokens = await db.sql`SELECT * FROM tokens`

    
    // Return the tokens as JSON
    return { 
      success: true, 
      tokens: tokens.rows 
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching tokens:', error)
    
    // Return error response
    return { 
      success: false, 
      error: 'Failed to retrieve tokens',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
