const express = require('express');
const router = express.Router();
const { register, login, updateProfile, saveFcmToken } = require('./../controllers/authcontroller');
const { protect } = require('./../middlewares/authmiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.post('/fcm-token', protect, saveFcmToken);

module.exports = router;
