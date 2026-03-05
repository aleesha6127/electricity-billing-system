# PowerGrid Setup Guide

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file with the following content:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=powergrid_secret_key_change_in_production
```

3. Install dependencies (if not already done):
```bash
npm install
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the root directory (user-page):
```bash
cd ..
```

2. Create a `.env` file in the root directory with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Install dependencies (if not already done):
```bash
npm install
```

4. Start the frontend:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Running Both Servers

### Option 1: Two Terminal Windows
- Terminal 1: `cd backend && npm start`
- Terminal 2: `cd user-page && npm start`

### Option 2: Use npm-run-all (if installed)
```bash
npm install --save-dev npm-run-all
```

Then add to package.json:
```json
"scripts": {
  "dev": "npm-run-all --parallel start:backend start:frontend",
  "start:backend": "cd backend && npm start",
  "start:frontend": "react-scripts start"
}
```

## Default Credentials

- Meter Serial: MTR-001
- Phone Number: 9876543210

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/profile` - Get profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)

### Payments
- `GET /api/payments/history` - Get payment history (requires auth)
- `POST /api/payments/add-funds` - Add funds (requires auth)
- `POST /api/payments/pay-bill` - Pay bill (requires auth)

### Dashboard
- `GET /api/dashboard/data` - Get dashboard data (requires auth)

## Notes

- All currency values are displayed in Indian Rupee (₹)
- Backend uses JSON file storage (data/users.json and data/payments.json)
- JWT tokens are used for authentication
- CORS is enabled for localhost development


