import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";

function UserLogin() {
  const [meterId, setMeterId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!meterId.trim()) {
      alert("Please enter Meter ID");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const ref = doc(db, "meters", meterId.trim());
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Meter ID not found");
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (data.phone !== phone) {
        alert("Phone number does not match this meter");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS LOGIN
      localStorage.setItem("meterId", meterId.trim());
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <div className="login-container">
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

        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">User Login</h2>
            <p className="login-subtitle">Enter your meter details to access your account</p>
          </div>

          <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="form-group">
              <label htmlFor="meterId">Meter ID</label>
              <div className="input-wrapper">
                <span className="input-icon">#</span>
                <input
                  id="meterId"
                  type="text"
                  value={meterId}
                  onChange={(e) => setMeterId(e.target.value.toUpperCase())}
                  placeholder="MTR-0002"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.64 12.64 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.64 12.64 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="9876543210"
                />
              </div>
            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
              <span className="arrow-icon">→</span>
            </button>
          </form>

          <div className="demo-credentials">
            Use demo: Meter ID MTR-0002, Phone 9876543210
          </div>
        </div>

        <footer className="app-footer">
          <p>© PowerGrid</p>
        </footer>
      </div>
    </div>
  );
}

export default UserLogin;
