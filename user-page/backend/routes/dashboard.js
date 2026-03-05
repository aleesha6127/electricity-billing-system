const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { findUserById, getPaymentsByUserId } = require('../data/database');

// Get dashboard data
router.get('/data', authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const unitsConsumed = user.currentReading - user.previousReading;
    const currentBill = unitsConsumed * user.tariffRate;

    // Consumption data for graph (last 7 days)
    const consumptionData = [
      { day: 'Mon', voltage: 232, current: 8.4, power: 1950 },
      { day: 'Tue', voltage: 230, current: 8.2, power: 1886 },
      { day: 'Wed', voltage: 231, current: 8.1, power: 1871 },
      { day: 'Thu', voltage: 232, current: 8.4, power: 1948 },
      { day: 'Fri', voltage: 230, current: 8.3, power: 1909 },
      { day: 'Sat', voltage: 231, current: 8.5, power: 1963 },
      { day: 'Sun', voltage: 232, current: 8.4, power: 1948 }
    ];

    // Get recent payments (last 2)
    const allPayments = getPaymentsByUserId(user.id);
    const recentPayments = allPayments.slice(0, 2);

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      unitsConsumed,
      currentBill,
      consumptionData,
      recentPayments
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

module.exports = router;


