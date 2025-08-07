const { PrismaClient } = require('../generate/prisma')
const prisma = PrismaClient()
const {getClientIP, getCustomerID} = require('../utils/userInfo')
const handleLogEvent = async ({customerId,
  method,
  path,
  statusCode,
  ipAddress,
  userAgent,
  responseTime,
  error}
) => {
  try {
    await prisma.requestLog.create({
      data: {
        customerId,
        method,
        path,
        statusCode,
        ipAddress,
        userAgent,
        responseTime,
        error
      }
    });
  } catch (err) {
    console.error('Error logging request:', err);
  }
}


const reqLogger = async (req, res, next) => {
    const start = Date.now()
    const clientIP = getClientIP(req)
    await handleLogEvent({
        customerId : getCustomerID(req),
        method: req.method,
        path: req.url,
        statusCode: req.statusCode,
        origin: req.headers.origin,
        ipAddress: clientIP,
        userAgent: req.headers['user-agent'],
        responseTime: Date.now() - start,
        error: res.locals?.error || null
    })
}


module.exports = reqLogger;