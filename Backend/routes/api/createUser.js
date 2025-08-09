const router = require('express').Router();
const {createUser, verifyPhone} = require('../../controllers/createUserController')

router.post('/details', createUser);
router.get('/details', (req, res) => res.send("YE chal raha hai"))
router.post('/verification/phone', verifyPhone);
// router.post('/verification/email', verifyEmail);

module.exports = router