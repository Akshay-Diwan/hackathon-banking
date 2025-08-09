const router = require('express').Router();
const upload = require('../../middlewares/fileUpload')
const allUserInfoController = require('../../controllers/allUserInfoController')

router.post('/', upload.fields([
    { name: "aadhaar", maxCount: 2 },
    { name: "pan", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]), allUserInfoController);
router.get('/', (req, res)=> {
  res.send("ye chal raha hai")
})
module.exports = router