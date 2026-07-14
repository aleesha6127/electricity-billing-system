# ⚡ PowerGrid – Smart Electricity Billing System

PowerGrid is a full-stack electricity billing and meter management system designed to monitor electricity usage, manage smart meters, calculate billing information, and provide users with a modern dashboard for payments and account management.

## 🌐 Live Demo

🔗 https://electricity-billing-system-psi.vercel.app

## 🚀 Features

### 👨‍💼 Admin Module

- Admin dashboard
- Add and manage electricity meters
- View meter information
- Monitor voltage, current, and power
- Search meter records
- Remove meters
- Real-time meter data integration

### 👤 User Module

- Meter ID and phone number authentication
- Secure JWT-based login
- User dashboard
- View electricity consumption
- Monitor voltage, current, and power
- View current electricity bill
- Wallet balance management
- Payment history
- Pay electricity bills
- User profile management

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Create React App
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- REST API

### Database & Real-Time Data

- Firebase
- Firestore

### Deployment

- Vercel – Frontend
- Render – Backend

## 🏗️ Project Architecture

PowerGrid uses a full-stack architecture:

React Frontend
        ↓
REST API
        ↓
Node.js + Express Backend
        ↓
Firebase / Application Data

The frontend communicates with the deployed backend API for authentication, payments, profile management, and dashboard information.

## 📂 Project Structure

```text
electricity-billing-system/
│
├── meter-admin/
│   └── Admin dashboard
│
├── user-page/
│   ├── backend/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── firebase/
│       ├── pages/
│       └── services/
│
└── README.md
```

## 🔐 Authentication

PowerGrid uses JWT-based authentication.

Users log in using:

- Meter ID
- Registered phone number

After successful authentication, the user receives an authentication token used for protected API requests.

## 📊 Dashboard

The user dashboard displays:

- Power consumption
- Electricity units (kWh)
- Current electricity bill
- Wallet balance
- Voltage
- Current
- Power
- Electricity tariff
- Recent payment history

## 🔥 Real-Time Monitoring

Electricity meter information such as voltage, current, power, and kWh can be updated using Firebase real-time data integration.

## 💳 Payment Management

Users can:

- View payment history
- Add funds to their wallet
- Pay electricity bills
- Monitor wallet balance

## 📸 Screenshots

### Admin Login

![Admin Login](screenshots/admin-login.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### Add New Meter

![Add Meter](screenshots/add-meter.png)

### User Login

![User Login](screenshots/user-login.png)

### User Dashboard

![User Dashboard](screenshots/user-dashboard.png)

### Payments

![Payments](screenshots/payments.png)

### User Profile

![Profile](screenshots/profile.png)

## ⚙️ Local Setup

Clone the repository:

```bash
git clone https://github.com/aleesha6127/electricity-billing-system.git
```

### User Frontend

```bash
cd electricity-billing-system/user-page
npm install
npm start
```

### Backend

```bash
cd electricity-billing-system/user-page/backend
npm install
npm start
```

### Admin Dashboard

```bash
cd electricity-billing-system/meter-admin
npm install
npm run dev
```

## 🌍 Environment Variables

Frontend:

```env
REACT_APP_API_URL=YOUR_BACKEND_API_URL
```

Backend:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=YOUR_JWT_SECRET
```

Never commit production secrets to the repository.

## 🚀 Deployment

The PowerGrid user application is deployed using:

- Frontend: Vercel
- Backend API: Render

Live Application:

https://electricity-billing-system-psi.vercel.app

## 👩‍💻 Developer

**Aleesha Anas**

GitHub: https://github.com/aleesha6127

LinkedIn: https://www.linkedin.com/in/aleesha-anas-a7553533b/

Portfolio: https://aleesha6127.github.io/portfolio/

## 📄 License

This project is developed for educational and portfolio purposes.
