const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users data
const initializeUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: '123 Main Street, City',
        meterSerial: 'MTR-001',
        tariffRate: 5.5,
        currentReading: 4680,
        previousReading: 4520,
        installationDate: '2024-01-01',
        walletBalance: 800,
        totalPaid: 1630,
        password: 'password123' // In production, this should be hashed
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
};

// Initialize payments data
const initializePayments = () => {
  if (!fs.existsSync(PAYMENTS_FILE)) {
    const defaultPayments = [
      {
        id: 1,
        userId: 1,
        date: '2024-01-15',
        amount: 880,
        method: 'Wallet',
        status: 'completed'
      },
      {
        id: 2,
        userId: 1,
        date: '2023-12-14',
        amount: 750,
        method: 'Card',
        status: 'completed'
      }
    ];
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(defaultPayments, null, 2));
  }
};

// Read users
const getUsers = () => {
  initializeUsers();
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

// Write users
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Read payments
const getPayments = () => {
  initializePayments();
  const data = fs.readFileSync(PAYMENTS_FILE, 'utf8');
  return JSON.parse(data);
};

// Write payments
const savePayments = (payments) => {
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
};

// Find user by meter serial and phone
const findUserByCredentials = (meterSerial, phone) => {
  const users = getUsers();
  return users.find(u => u.meterSerial === meterSerial && u.phone === phone);
};

// Find user by ID
const findUserById = (id) => {
  const users = getUsers();
  return users.find(u => u.id === parseInt(id));
};

// Get payments by user ID
const getPaymentsByUserId = (userId) => {
  const payments = getPayments();
  return payments.filter(p => p.userId === parseInt(userId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

module.exports = {
  getUsers,
  saveUsers,
  getPayments,
  savePayments,
  findUserByCredentials,
  findUserById,
  getPaymentsByUserId
};


