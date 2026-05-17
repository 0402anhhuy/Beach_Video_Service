const express = require('express');
const router = express.Router();
const { register, verify, login, forgotPassword, verifyResetOtp, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify', verify);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;