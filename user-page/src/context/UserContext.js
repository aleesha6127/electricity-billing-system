import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // Load user state from localStorage
  const loadUserState = () => {
    const saved = localStorage.getItem('userState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading user state:', e);
      }
    }
    return {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main Street, City',
      meterSerial: 'MTR-001',
      tariffRate: 5.5, // ₹ per kWh
      currentReading: 4680, // kWh
      previousReading: 4520, // kWh
      installationDate: '2024-01-01',
      walletBalance: 800,
      totalPaid: 1630,
      isLoggedIn: false
    };
  };

  const [user, setUser] = useState(loadUserState);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userState', JSON.stringify(user));
  }, [user]);

  const loadPaymentHistory = () => {
    const saved = localStorage.getItem('paymentHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading payment history:', e);
      }
    }
    return [
      { id: 1, date: '2024-01-15', amount: 880, method: 'Wallet', status: 'completed' },
      { id: 2, date: '2023-12-14', amount: 750, method: 'Card', status: 'completed' }
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const [paymentHistory, setPaymentHistory] = useState(loadPaymentHistory);

  // Save payment history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  // Calculate units consumed
  const unitsConsumed = user.currentReading - user.previousReading;
  
  // Calculate current bill based on units consumed and tariff rate
  const currentBill = unitsConsumed * user.tariffRate;

  // Consumption data for graph (last 7 days)
  const [consumptionData] = useState([
    { day: 'Mon', voltage: 232, current: 8.4, power: 1950 },
    { day: 'Tue', voltage: 230, current: 8.2, power: 1886 },
    { day: 'Wed', voltage: 231, current: 8.1, power: 1871 },
    { day: 'Thu', voltage: 232, current: 8.4, power: 1948 },
    { day: 'Fri', voltage: 230, current: 8.3, power: 1909 },
    { day: 'Sat', voltage: 231, current: 8.5, power: 1963 },
    { day: 'Sun', voltage: 232, current: 8.4, power: 1948 }
  ]);

  const login = (meterSerial, phoneNumber) => {
    if (meterSerial === 'MTR-001' && phoneNumber === '9876543210') {
      setUser(prev => ({ ...prev, isLoggedIn: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    localStorage.removeItem('userState');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addFunds = (amount) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    setPaymentHistory(prev => [{
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      method: 'Card',
      status: 'completed'
    }, ...prev]);
  };

  const payBill = (amount) => {
    if (user.walletBalance >= amount) {
      setUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        totalPaid: prev.totalPaid + amount,
        previousReading: prev.currentReading
      }));
      setPaymentHistory(prev => [{
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        amount: amount,
        method: 'Wallet',
        status: 'completed'
      }, ...prev]);
      return true;
    }
    return false;
  };

  const value = {
    user,
    paymentHistory,
    unitsConsumed,
    currentBill,
    consumptionData,
    login,
    logout,
    updateProfile,
    addFunds,
    payBill
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
