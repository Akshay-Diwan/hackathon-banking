const fs = require('fs')
const path = require('path')
const logger = require('../middlewares/dataLogger')
const streamVideosController = async (req, res)=> {
    try{
        await logger({
        action: "VIDEO STREAMING",
        status: "OK",
        details: "video sent successfully",
    })
    res.sendFile(path.join(__dirname, '..', 'Downloads', req.body.name + ".mp4"))
   
    }
    catch(err) {
        console.log(err);
        await logger({
        action: "VIDEO STREAMING",
        status: "ERROR",
        details: err,
    })
    res.status(500).json({"error" : "Internal Server error"})
    }
}

module.exports = streamVideosController;