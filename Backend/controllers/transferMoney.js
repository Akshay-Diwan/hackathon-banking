const logger = require('../middlewares/dataLogger')
const { PrismaClient } = require('../generate/prisma');
const prisma = new PrismaClient();

const transferMoney = async (req, res) => {
  const { amount, payment_method, sender_account_number, receiver_account_number, message, type, otp } = req.body;

  if (!amount || !payment_method || !sender_account_number || !receiver_account_number || !type) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Fetch sender and receiver accounts
      const sender = await tx.account.findUnique({
        where: { accountNumber: sender_account_number }
      });
      const receiver = await tx.account.findUnique({
        where: { accountNumber: receiver_account_number }
      });

      if (!sender || !receiver) {
        throw new Error('Sender or receiver account not found.');
      }

      if (sender.balance < amount) {
        throw new Error('Insufficient funds in sender account.');
      }

      // Deduct from sender
      await tx.account.update({
        where: { accountNumber: sender_account_number },
        data: { balance: { decrement: amount } }
      });

      // Add to receiver
      await tx.account.update({
        where: { accountNumber: receiver_account_number },
        data: { balance: { increment: amount } }
      });

      // Add transaction record
      await tx.transaction.create({
        data: {
          amount: amount,
          paymentMethod: payment_method,
          fromAccountId: sender_account_number,
          toAccountId: receiver_account_number,
          message,
          kind : type,
          type: "TRANSFER",
          timestamp: new Date()
        }
      });

      return { sender_account_number, receiver_account_number, amount };
    });
    logger(
      {
        action : "TRANSFER MONEY",
        status : "OK", 
        details : result
      }
    )
    res.status(200).json({
      "success" : result
    });
  } catch (err) {
    console.error(err);
     logger(
      {
        action : "TRANSFER MONEY",
        status : "ERROR", 
        details : err
      }
    )
    res.status(500).json({error: 'Internal server error.' });
     
  }
}

module.exports = transferMoney