const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/login', authController.getLoginPage)
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/signUp', authController.getSignUpPage);
router.post('/signUp', authController.signUp);

module.exports = router;