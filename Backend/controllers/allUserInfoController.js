const kycdocumentController = require("./kycdocumentController")

const allUserInfoController = async (req, res)=> {
    console.log("reached till here")
    try{
        console.log(await kycdocumentController(req, res, true))
        if(await kycdocumentController(req, res, true).success){
        console.log("chal gaya.....")
        res.status(200).json({"success" : "Account created successfully"})
        }
        else{
            console.log("yaha hai gadbad")
        res.status(500).json({"error" : "error hai"})
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({"error" : "error hai"})
    }
    
    

}

module.exports = allUserInfoController