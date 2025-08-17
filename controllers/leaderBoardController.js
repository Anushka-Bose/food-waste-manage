const User = require('./../models/user');

exports.getLeaderboard = async (req, res) => {
  try {
    const top = await User.find({}, 'name points role').sort({ points: -1 }).limit(10);
    res.json(top);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
