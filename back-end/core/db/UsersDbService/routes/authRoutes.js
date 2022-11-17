const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/create-user', authController.signup_post);
router.post('/check-user', authController.check_user_post);
router.post('/get-user-role', authController.get_user_role);
// router.post('/check-token',authController.check_token)

module.exports = router;