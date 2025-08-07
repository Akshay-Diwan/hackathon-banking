
const { logger } = require('../config/nodemailer');
const Feedback = require('../mongoSchema/feeback')
const {getCustomerID, getClientIP} = require('../utils/userInfo')

const feedbackController = async (req, res) => {
    const {feedback, from} = req.body;
    const customer_ID = getCustomerID(req)
    try{
    await Feedback.create({
        customerId: customer_ID,
        feedback: feedback,
        from: from
    })
    await logger({
        customerId: customer_ID,
        ipAddress: getClientIP(req),
        action: "CUSTOMER FEEDBACK",
        status: "OK",
        details: "feedback stored successfully"
    })
    res.status(200).json({"success" : "feedback stored successfully"})
}
catch(err){
    console.log(err)
    res.status(500).json({"error" : "feedback could not be stored"})
    await logger({
        customerId: customer_ID,
        ipAddress: getClientIP(req),
        action: "CUSTOMER FEEDBACK",
        status: "ERROR",
        details: err,
    })
}   
}

module.exports = feedbackController;