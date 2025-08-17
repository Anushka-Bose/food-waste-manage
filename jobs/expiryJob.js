const cron = require('node-cron');
const FoodListing = require('./../models/foodListing');

module.exports = function runExpiryJob(){
  cron.schedule('*/15 * * * *', async () => {
    try {
      const now = new Date();
      const result = await FoodListing.updateMany(
        { expiryTimestamp: { $lt: now }, status: 'available' },
        { $set: { status: 'expired' } }
      );
      if (result.modifiedCount) {
        console.log(`Expired ${result.modifiedCount} listings at ${now.toISOString()}`);
      }
    } catch (e) {
      console.error('Expiry job error:', e.message);
    }
  });
};
