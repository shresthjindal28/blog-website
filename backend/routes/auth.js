const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    // Hash password and save (hashing is done via pre-save hook)
    await user.save();

    // Create JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists - explicitly include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = user.generateAuthToken();

    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { username, avatarUrl, email, phoneNumber } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id || req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If email is being updated, check if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    
    // Update fields
    if (username) user.username = username;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/update-settings
// @desc    Update user settings
router.put('/update-settings', auth, async (req, res) => {
  try {
    const { darkMode, emailNotifications, language } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id || req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update preferences
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
    if (language) user.preferences.language = language;
    
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Find user by ID - explicitly include password field
    const user = await User.findById(req.user.id || req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 