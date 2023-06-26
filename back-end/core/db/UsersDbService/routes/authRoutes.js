const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/create-user', authController.signup_post);
router.post('/check-user', authController.check_user_post);
router.post('/collect-user-data', authController.collect_user_data);
router.get('/all-users', authController.all_users)

router.post('/update-fields', authController.update_fields)
router.post('/delete', authController.delete)

// router.post('/check-token',authController.check_token)

module.exports = router;