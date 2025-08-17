const express = require('express');
const router = express.Router();
const { protect } = require('./../middlewares/authmiddleware');
const { updateProfile, saveFcmToken } = require('./../controllers/authcontroller');

router.put('/profile', protect, updateProfile);
router.post('/fcm-token', protect, saveFcmToken);

module.exports = router;
