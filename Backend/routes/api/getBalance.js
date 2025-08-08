const { getCustomerID } = require('../../utils/userInfo');
const {PrismaClient} = require("../../generate/prisma")
const prisma = new PrismaClient();
const router = require('express').Router();

router.get('/', async (req, res)=> {
    const customer_ID = getCustomerID(req);
    const account_number = req.body.account_number;
    try{
    const account = prisma.account.findOne({
        where: {
            accountNumber: account_number
        }
    })
    const balance = account.balance;
    res.status(200).json({"success" : "balance fetched", "message" : balance})
}
catch(err) { 
    console.log(err);
    res.status(500).json({error: "error in fetching account"})
}
});

module.exports = router