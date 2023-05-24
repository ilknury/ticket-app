const express = require('express');
const router = express.Router();
const { postRegister, verifyEmail, postLogin, postPersonnelLogin, checkToken } = require('../controllers/AuthController');


router.post('/register', postRegister);
router.post('/login', postLogin);
router.post('/personnel-login', postPersonnelLogin);
router.get('/check-token', checkToken);
router.get('/student/:id/verify/:verificationCode', verifyEmail);

module.exports = router;