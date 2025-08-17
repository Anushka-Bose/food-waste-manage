const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ token: genToken(user._id), user: { id: user._id, name, email, role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { role, preferences, location } = req.body;
    const updated = await User.findByIdAndUpdate(req.user.id, { role, preferences, location }, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) return res.status(400).json({ message: 'FCM token is required' });
    await User.findByIdAndUpdate(req.user.id, { fcmToken });
    res.json({ message: 'FCM token saved successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
