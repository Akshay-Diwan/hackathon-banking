const router = require('express').Router();
const showQuiz = require('../../controllers/quizController')

router.get('/', showQuiz);

module.exports = router;