const cron = require('node-cron');
const FoodListing = require('./../models/foodListing');
const User = require('./../models/user');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

module.exports = function runAnalyticsJob(){
  cron.schedule('0 0 * * *', async () => {
    try {
      const totalListings = await FoodListing.countDocuments();
      const totalPickups = await FoodListing.countDocuments({ status: 'picked' });
      const totalUsers = await User.countDocuments();
      const avgAgg = await User.aggregate([{ $group: { _id: null, avgPoints: { $avg: '$points' } } }]);
      await AnalyticsSnapshot.create({
        totalListings,
        totalPickups,
        totalUsers,
        averagePoints: avgAgg[0]?.avgPoints || 0
      });
      console.log('Analytics snapshot saved');
    } catch (e) {
      console.error('Analytics job error:', e.message);
    }
  });
};
