const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/google-register', authController.googleRegister);
router.post('/google-login', authController.loginWithGoogle);

module.exports = router;