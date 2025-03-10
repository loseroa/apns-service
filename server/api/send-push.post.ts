import http2 from 'http2'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { teamId, keyId, p8Content, pushToken, bundleId, payload, priority } = body

  try {
    // Generate JWT token
    const token = jwt.sign(
      {
        iss: teamId,
        iat: Math.floor(Date.now() / 1000)
      },
      p8Content,
      {
        header: {
          alg: "ES256",
          kid: keyId,
        }
      }
    )

    // Make APNS request
    return await new Promise((resolve, reject) => {
      const client = http2.connect('https://api.sandbox.push.apple.com')

      client.on('error', (err) => {
        client.destroy()
        reject(createError({ 
          statusCode: 500,
          statusMessage: `Connection error: ${err.message}`
        }))
      })

      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${pushToken}`,
        'authorization': `bearer ${token}`,
        'apns-push-type': 'liveactivity',
        'apns-topic': `${bundleId}.push-type.liveactivity`,
        'apns-priority': priority || '5',
      })

      req.setEncoding('utf8')
      let data = ''

      req.on('data', (chunk) => {
        data += chunk
      })

      req.on('end', () => {
        client.close()
        if (data) {
          reject(createError({ 
            statusCode: 400,
            statusMessage: data
          }))
        } else {
          resolve({ success: true })
        }
      })

      req.on('error', (err) => {
        client.destroy()
        reject(createError({ 
          statusCode: 500,
          statusMessage: `Request error: ${err.message}`
        }))
      })

      req.write(JSON.stringify(payload))
      req.end()
    })

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
})
