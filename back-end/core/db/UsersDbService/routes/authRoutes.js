const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.post('/check-token',authController.check_token)

module.exports = router;