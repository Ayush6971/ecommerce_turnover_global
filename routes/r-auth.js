const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/login', authController.getLoginPage)
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/sign-up', authController.getSignUpPage);
router.post('/sign-up', authController.signUp);
router.get('/:id/verify-otp', authController.getVerifyOtpPage)
router.post('/verify', authController.verify)

module.exports = router;