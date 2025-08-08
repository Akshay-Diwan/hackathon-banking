const {sendOTP } =require('../../utils/otpFunctions')
const router = require('express').Router();
const {getUser} = require('../../tempStorage')
router.get('/', (req, res)=> {
    const session_ID = req.cookies.sesssion_ID;
    const user = getUser(session_ID);
    const phone = user.phone;
    try{
    sendOTP(phone);
    res.status(200).json({"success" : "Otp sent"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({"error" : "OTP not sent"})
    }
});

module.exports = router