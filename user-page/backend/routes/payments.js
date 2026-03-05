const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUsers, saveUsers, getPayments, savePayments, getPaymentsByUserId } = require('../data/database');

// Get payment history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const payments = getPaymentsByUserId(req.user.id);
    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
});

// Add funds to wallet
router.post('/add-funds', authenticateToken, (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add funds to wallet
    users[userIndex].walletBalance += parseFloat(amount);

    // Add payment record
    const payments = getPayments();
    const newPayment = {
      id: Date.now(),
      userId: req.user.id,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      method: 'Card',
      status: 'completed'
    };
    payments.push(newPayment);

    saveUsers(users);
    savePayments(payments);

    res.json({
      success: true,
      message: `₹${amount.toFixed(2)} added to wallet successfully`,
      walletBalance: users[userIndex].walletBalance,
      payment: newPayment
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding funds'
    });
  }
});

// Pay bill
router.post('/pay-bill', authenticateToken, (req, res) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[userIndex];
    const unitsConsumed = user.currentReading - user.previousReading;
    const currentBill = unitsConsumed * user.tariffRate;

    if (currentBill <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No pending bills to pay'
      });
    }

    if (user.walletBalance < currentBill) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Please add ₹${(currentBill - user.walletBalance).toFixed(2)} to your wallet`,
        requiredAmount: currentBill - user.walletBalance
      });
    }

    // Deduct bill amount from wallet
    users[userIndex].walletBalance -= currentBill;
    users[userIndex].totalPaid += currentBill;
    users[userIndex].previousReading = user.currentReading;

    // Add payment record
    const payments = getPayments();
    const newPayment = {
      id: Date.now(),
      userId: req.user.id,
      date: new Date().toISOString().split('T')[0],
      amount: currentBill,
      method: 'Wallet',
      status: 'completed'
    };
    payments.push(newPayment);

    saveUsers(users);
    savePayments(payments);

    res.json({
      success: true,
      message: `Bill of ₹${currentBill.toFixed(2)} paid successfully`,
      walletBalance: users[userIndex].walletBalance,
      totalPaid: users[userIndex].totalPaid,
      payment: newPayment
    });
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment'
    });
  }
});

module.exports = router;


