const logger = async ({userId,ipAddress, action, status, details}) => {
    const entry = {
        customerId,
        ipAddress,
        action, 
        status,
        details
    }
  try {
    await prisma.log.create({
      data: entry
    });
  } catch (err) {
    console.error('Error logging event:', err);
  }
};


module.exports = logger;