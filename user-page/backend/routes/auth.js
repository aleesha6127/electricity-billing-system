const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { findUserByCredentials } = require('../data/database');

// Login
router.post('/login', (req, res) => {
  try {
    const { meterSerial, phoneNumber } = req.body;

    if (!meterSerial || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Meter serial number and phone number are required'
      });
    }

    const user = findUserByCredentials(meterSerial, phoneNumber);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, meterSerial: user.meterSerial },
      process.env.JWT_SECRET || 'powergrid_secret_key_change_in_production',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'powergrid_secret_key_change_in_production', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      decoded
    });
  });
});

module.exports = router;


