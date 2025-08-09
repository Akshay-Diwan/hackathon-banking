const {getUser} = require('../tempStorage')

function getClientIP(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // x-forwarded-for may contain multiple IPs, first one is the real client IP
        return xForwardedFor.split(',')[0].trim();
    }
  return req.socket?.remoteAddress || req.ip;
}
function getCustomerID(req) {
    console.log("Cookies : " + Object.keys(req.cookies))

    if(req?.cookies?.sessionID){
        return getUser(req.cookies.sessionID).customerId
    }
    else if(req.body.customer_ID){

        return req.bod.customer_ID
    }
    else{ 
        return null;
    }
}
module.exports = {getClientIP, getCustomerID}