const { PrismaClient } = require('../generate/prisma')
const bcrypt =  require('bcrypt')
const prisma = new PrismaClient()
const {v4: uuid} = require('uuid')
// const {setUser, deleteTempUserData} = require('../tempStorage')
const handleLogin = async (req, res)=>{
    const phone = req.body.phone;
    const password = req.body.password;
    let user;
    try{
        console.log("Inside Login")
        console.log(req.body)
    if(!password){
        res.status(401).json({"error": "Credentials required"})
        console.log("Credentials required")
        return
    }

    if(phone){
         user = await prisma.user.findUnique({
            where: {
                phone: phone
            }
        })
    }
    else{
        console.log("Credentials required")
        res.status(401).json({"error": "Credentials required"})
        return
    }
    if(user && await bcrypt.compare(password, user.password)){
        // res.cookie("sessionID", uuid(),{
        //     expiresIn: '30m'
        // })
        const sessionID = uuid()
        // deleteTempUserData(sessionID)
        // setUser(sessionID,{name: user.name,email: user.email,phone: user.phone})
        res.cookie("sessionID", sessionID, {
            httpOnly : false,
            secure: false,
            maxAge: 1 * 60 * 60 * 1000
        })
        
        res.status(200).json({
            success: true,
            name: user.name,
            phone: user.phone,
        })
    }
    else{
        console.log("Invalid credentials")
        res.status(401).json({"error": "invalid credentials"})
    }
}
catch(err){
    console.log(err);
    res.status(500).json({"error": "Internal Server error"})
}
}
module.exports = handleLogin