const crypto = require('crypto')
const twilio = require("twilio");
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const transporter = require('../config/nodemailer')
const email_template = require('../mongoSchema/email')
const sendOTP = (phone) => {
  client.verify.v2
    .services(process.env.SERVICE)
    .verifications.create({ to: `+91${phone}`, channel: "sms" })
    .then((verification) => console.log(verification.sid));
};
function generateOTP() {
    let numbers = [1, 2, 3, 4,5,6,7,8,9,0]
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += numbers[crypto.randomInt(numbers.length)];
  }
  return otp;
}
async function phoneOTPVerification(otp, phone) {
    return await client.verify.v2
        .services(process.env.SERVICE)
        .verificationChecks.create({
        code: `${otp}`,
        to: `+91${phone}`,
        });
}

async function sendEmailOTP(unverified_user, otp) {
    console.log("email sent to : " + unverified_user.email)
    let text = await email_template.findOne({
      type: "OTP"
    });
    text = text.replaceOne("[OTP]", otp);
    
    return transporter.sendMail({
    from: process.env.SMTP_USER,
    to: unverified_user.email,
    subject: "Email Verification",
    text: text
  });
}
module.exports = {sendOTP, sendEmailOTP, generateOTP, phoneOTPVerification}