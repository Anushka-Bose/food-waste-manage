const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('./../controllers/leaderBoardController');

router.get('/', getLeaderboard);

module.exports = router;
