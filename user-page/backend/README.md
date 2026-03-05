# PowerGrid Backend API

Backend API for PowerGrid Electricity Billing Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=powergrid_secret_key_change_in_production
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Payments
- `GET /api/payments/history` - Get payment history (requires auth)
- `POST /api/payments/add-funds` - Add funds to wallet (requires auth)
- `POST /api/payments/pay-bill` - Pay current bill (requires auth)

### Dashboard
- `GET /api/dashboard/data` - Get dashboard data (requires auth)

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Default User Credentials

- Meter Serial: MTR-001
- Phone: 9876543210


