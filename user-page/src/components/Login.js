import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Login.css';

function Login() {
  const [meterSerial, setMeterSerial] = useState('MTR-001');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(meterSerial, phoneNumber)) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Please use: Meter: MTR-001, Phone: 9876543210');
    }
  };

  return (
    <div className="App">
      <div className="login-container">
        {/* Header Section */}
        <header className="app-header">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="#2563EB"/>
              <path d="M24 12L18 24H22L20 36L30 24H26L24 12Z" fill="white"/>
            </svg>
          </div>
          <h1 className="app-title">PowerGrid</h1>
          <p className="app-tagline">Electricity Billing Management</p>
        </header>

        {/* Login Form Card */}
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">User Login</h2>
            <p className="login-subtitle">Enter your meter details to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="meterSerial">Meter Serial Number</label>
              <div className="input-wrapper">
                <span className="input-icon">#</span>
                <input
                  type="text"
                  id="meterSerial"
                  value={meterSerial}
                  onChange={(e) => setMeterSerial(e.target.value)}
                  placeholder="MTR-001"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon phone-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                />
              </div>
            </div>

            <button type="submit" className="login-button">
              Login
              <span className="arrow-icon">→</span>
            </button>

            <a href="#" className="forgot-password">Forgot Password?</a>

            <div className="demo-credentials">
              Demo: Meter: MTR-001 | Phone: 9876543210
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>© 2024 PowerGrid. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;



