const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/google-register', authController.googleRegister);
router.post('/register', upload.single('avatar'), authController.register);

router.post('/google-login', authController.loginWithGoogle);
router.post('/login', authController.login);

router.put('/user/:id', upload.single('avatar'), authController.updateUser);

router.post('/update-password', authenticate, authController.updatePassword);

module.exports = router;