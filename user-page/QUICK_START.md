# 🚀 Quick Start Guide - Fix Login Error

## Problem
You're seeing "Invalid credentials" error because the **backend server is not running**.

## Solution - Follow These Steps:

### Step 1: Open Terminal/Command Prompt

You need **TWO terminal windows** - one for backend, one for frontend.

---

### Step 2: Start Backend Server

**Terminal 1:**
```bash
cd user-page/backend
```

Create `.env` file (if it doesn't exist):
```bash
# Windows PowerShell:
echo "PORT=5000`nNODE_ENV=development`nJWT_SECRET=powergrid_secret_key_change_in_production" > .env

# Or manually create .env file with:
PORT=5000
NODE_ENV=development
JWT_SECRET=powergrid_secret_key_change_in_production
```

Start backend:
```bash
npm start
```

**✅ You should see:** `🚀 Server is running on http://localhost:5000`

**Keep this terminal open!**

---

### Step 3: Start Frontend (In New Terminal)

**Terminal 2:**
```bash
cd user-page
```

Create `.env` file (if it doesn't exist):
```bash
# Windows PowerShell:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Or manually create .env file with:
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

**✅ Browser should open automatically at `http://localhost:3000`**

---

### Step 4: Test Login

1. Make sure **both terminals are running** (backend on port 5000, frontend on port 3000)
2. Go to login page
3. Use these credentials:
   - **Meter Serial:** MTR-001
   - **Phone Number:** 9876543210
4. Click **Login**

**✅ It should work now!**

---

## Troubleshooting

### ❌ Still getting "Invalid credentials"?

1. **Check if backend is running:**
   - Open browser: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"PowerGrid API is running"}`

2. **Check browser console (F12):**
   - Look for errors like "Failed to fetch" or "Network error"
   - This means backend is not running

3. **Check backend terminal:**
   - Should see: `🚀 Server is running on http://localhost:5000`
   - If you see errors, check if port 5000 is already in use

### ❌ Port 5000 already in use?

Change backend port in `.env`:
```
PORT=5001
```

Then update frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

### ❌ CORS errors?

Make sure backend `server.js` has CORS enabled (it should already be there).

---

## Visual Checklist

- [ ] Backend terminal shows: `🚀 Server is running on http://localhost:5000`
- [ ] Frontend terminal shows: `Compiled successfully!`
- [ ] Browser is open at `http://localhost:3000`
- [ ] Backend health check works: `http://localhost:5000/api/health`
- [ ] Login credentials: MTR-001 / 9876543210

---

## Need Help?

1. Check both terminal windows for error messages
2. Check browser console (Press F12 → Console tab)
3. Make sure both servers are running before trying to login


