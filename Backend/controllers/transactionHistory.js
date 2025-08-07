const { PrismaClient } = require('../generate/prisma');
const prisma = new PrismaClient();
const {getCustomerID, getClientIP} = require('../utils/userInfo')
const getTransactionHistory = async (req, res) => {
  const { account_number } = req.body;

  if (!account_number) {
    return res.status(400).json({ error: 'account_number is required.' });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { 
        OR:{
        fromAccountId : account_number,
        toAccountId: account_number
        }
        // date: {
        //   gt: new Date(after_date)
        // }
       },
      orderBy: { timestamp: 'desc' },
      take: 10
    });
     logger(
      {
        customerId: getCustomerID(req),
        ipAddress: getClientIP(req),
        action : "SHOW TRANSACTIONS",
        status : "OK", 
        details : "success"
      }
    )
    res.status(200).json({ transactions });
  } catch (err) {
    console.error(err);
    logger(
      {
        action : "SHOW TRANSACTIONS",
        status : "ERROR", 
        details : err
      }
    )
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = getTransactionHistory;