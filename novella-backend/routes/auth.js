const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Member = require('../models/Member');
const config = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, bio, interests, preferences } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await Member.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const member = new Member({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      age,
      bio: bio || '',
      interests: interests || [],
      preferences: preferences || {},
      verification_token: uuidv4()
    });

    await member.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: member._id, email: member.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: member.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const member = await Member.findOne({ email: email.toLowerCase() });
    if (!member) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last active
    await member.updateLastActive();

    // Generate JWT token
    const token = jwt.sign(
      { id: member._id, email: member.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.json({
      message: 'Login successful',
      token,
      user: member.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(member.toJSON());
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'bio', 'interests', 'preferences', 'age'];
    const filteredUpdates = {};

    // Filter allowed updates
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const member = await Member.findByIdAndUpdate(
      req.user.id,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: member.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update user location
router.put('/location', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const member = await Member.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Location updated successfully',
      location: member.location
    });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Update user status
router.put('/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const member = await Member.findByIdAndUpdate(
      req.user.id,
      { $set: { status } },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Status updated successfully',
      status: member.status
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await member.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    member.password = newPassword;
    await member.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Verify token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ 
    valid: true, 
    user: { id: req.user.id, email: req.user.email } 
  });
});

// Refresh token
router.post('/refresh', authMiddleware, (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;