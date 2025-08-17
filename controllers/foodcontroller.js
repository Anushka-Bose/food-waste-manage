const FoodListing = require('./../models/foodListing');
const User = require('./../models/user');
const { sendFoodNotification } = require('../services/notificationService');

// Create
exports.createFoodListing = async (req, res) => {
  try {
    const { title, type, quantity, freshness, availabilityWindow, location, expiryTimestamp } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const food = await FoodListing.create({
      title, type, quantity, freshness, availabilityWindow, location,
      imageUrl, expiryTimestamp, createdBy: req.user.id, status: 'available'
    });

    // Notify
    sendFoodNotification(food);
    res.status(201).json(food);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Read all available
exports.getAvailableFood = async (req, res) => {
  try {
    const list = await FoodListing.find({ status: 'available' })
      .sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Read single
exports.getFoodById = async (req, res) => {
  try {
    const item = await FoodListing.findById(req.params.id).populate('createdBy', 'name');
    if (!item) return res.status(404).json({ message: 'Food not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Update
exports.updateFoodListing = async (req, res) => {
  try {
    const food = await FoodListing.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (req.file) req.body.imageUrl = req.file.path;
    Object.assign(food, req.body);
    await food.save();
    res.json(food);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Delete
exports.deleteFoodListing = async (req, res) => {
  try {
    const food = await FoodListing.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await food.deleteOne();
    res.json({ message: 'Food deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Mark as picked + award points
exports.markAsPicked = async (req, res) => {
  try {
    const food = await FoodListing.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.status === 'picked') return res.status(400).json({ message: 'Already picked' });

    food.status = 'picked';
    const points = Math.floor(food.quantity * 2);
    food.lastPointsAwarded = points;
    await food.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { points } });
    res.json({ message: 'Marked as picked', pointsEarned: points });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Cancel pickup - deduct points
exports.cancelPickup = async (req, res) => {
  try {
    const food = await FoodListing.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.status !== 'picked') return res.status(400).json({ message: 'Not picked yet' });

    const points = food.lastPointsAwarded || 0;
    food.status = 'available';
    food.lastPointsAwarded = 0;
    await food.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { points: -points } });
    res.json({ message: 'Pickup canceled', pointsDeducted: points });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
