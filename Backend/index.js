const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const transfer = require('./routes/api/transfer')
const transactionHistory = require('./routes/api/transactionHistory')
const dashboard = require('./routes/api/dashboard')
const createUser = require('./routes/api/createUser')
const login = require('./routes/api/login');
const logout =require('./routes/api/logout');
const verifySMPT = require('./routes/api/verifySMTPConnection')
const kycdocuments = require('./routes/api/kycdocuments')
const videoKYC = require('./routes/api/videoKYC')
const getBalance = require('./routes/api/getBalance')
const requestOtp = require('./routes/api/requestOtp')
const allUSerInfo = require('./routes/api/allUserInfo')
const connectMongoDb = require('./config/mongodb')
const reqLogger = require('./middlewares/reqLogger')
const verifyUser = require('./middlewares/verifyUser')
const cors = require('cors')
require('dotenv').config()
// Middleware
app.use(cors({
  origin : process.env.ORIGIN,
  credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
// Request Logging
// app.use(reqLogger)
// Routes
app.use('/verifySMTP', verifySMPT)
app.use('/login', login);
app.use('/logout', logout)
app.use('/createUser', createUser);
app.use('/allUserInfo', allUSerInfo);
app.use(verifyUser)
app.use('/requestOtp', requestOtp)
app.use('/getBalance', getBalance)
app.use('/transfer',transfer);
app.use('/history', transactionHistory);
// app.use('/dashboard', dashboard);

// app.use('/loan', loan);
app.use('/KYCdocuments', kycdocuments) 
app.use('/videoKYC', videoKYC)
// Start server
connectMongoDb()
.then( ()=> {
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
)
.catch((err) => {
  console.log("could not connect to mongodb")
  console.log(err);
})
