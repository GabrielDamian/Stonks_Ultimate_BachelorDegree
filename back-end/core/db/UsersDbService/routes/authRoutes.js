const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/user/:id', authController.user_data);

router.get('/user', authController.all_users)

router.post('/user', authController.signup);

router.post('/login', authController.login);

router.post('/update', authController.update_fields)

router.delete('/delete/:id', authController.delete)

module.exports = router;