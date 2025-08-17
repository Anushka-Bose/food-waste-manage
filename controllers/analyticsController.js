const foodListing = require('../models/foodListing');
const User = require('../models/user');

exports.getAnalytics = async (req, res) => {
  try {
    const totalListings = await foodListing.countDocuments();
    const totalPickups = await foodListing.countDocuments({ status: 'picked' });
    const totalUsers = await User.countDocuments();
    const avgAgg = await User.aggregate([{ $group: { _id: null, avgPoints: { $avg: '$points' } } }]);
    res.json({
      totalListings,
      totalPickups,
      totalUsers,
      averagePoints: avgAgg[0]?.avgPoints || 0
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
