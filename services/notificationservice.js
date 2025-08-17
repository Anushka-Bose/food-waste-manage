const admin = require('./../config/firebase');
const User = require('./../models/user');

exports.sendFoodNotification = async (food) => {
  try {
    if (!admin?.messaging) return;
    const users = await User.find({ 'preferences.foodTypes': { $in: [food.type] } }).select('fcmToken');
    const tokens = users.map(u => u.fcmToken).filter(Boolean);
    if (!tokens.length) return;

    const message = {
      notification: { title: `New ${food.type} Available!`, body: `${food.title} at ${food.location}` },
      tokens
    };
    const res = await admin.messaging().sendMulticast(message);
    console.log(`Notifications sent: ${res.successCount}`);
  } catch (e) {
    console.error('Notification error:', e.message);
  }
};
