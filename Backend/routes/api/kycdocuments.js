const router = require('express').Router();
const upload = require('../../middlewares/fileUpload')
const folders = ["aadhaar", "pan", "photo", "address", "signature"];
const fs = require('fs');
const kycdocumentController = require('../../controllers/kycdocumentController')
folders.forEach(folder => {
  const dir = `./uploads/${folder}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Upload Route
router.post(
  "/",
  upload.fields([
    { name: "aadhaar-front", maxCount: 1 },
    {name: "aadhaar-back", maxCount: 1},
    { name: "pan", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  kycdocumentController
);

module.exports = router