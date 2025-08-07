function getClientIP(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // x-forwarded-for may contain multiple IPs, first one is the real client IP
        return xForwardedFor.split(',')[0].trim();
    }
  return req.socket?.remoteAddress || req.ip;
}
function getCustomerID(req) {
    if(req?.cookies?.session_ID){
        return getUser(req.cookies.session_ID)
    }
    else if(req.body.customer_ID){
        return req.bod.customer_ID
    }
    else{ 
        return null;
    }
}
module.exports = {getClientIP, getCustomerID}