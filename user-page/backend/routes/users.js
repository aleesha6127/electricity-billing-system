const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUsers, saveUsers, findUserById } = require('../data/database');

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.user;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, email, address } = req.body;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields (phone number cannot be changed)
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (address) users[userIndex].address = address;

    saveUsers(users);

    const { password, ...updatedUser } = users[userIndex];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

module.exports = router;

