import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Username already taken.' });
    }

    const user = await User.create({ username, password, userType });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, userType: user.userType },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ username, userType });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, userType: user.userType },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
