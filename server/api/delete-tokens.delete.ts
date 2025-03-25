import { TokenDeleteRequest } from "../types"

export default defineEventHandler(async (event) => {
  try {
    // Read and validate request body
    const body = await readBody<TokenDeleteRequest>(event)
    
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
      WHERE token = ${body.token}`

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
