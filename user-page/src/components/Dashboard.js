import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import './Dashboard.css';

function Dashboard() {
  const [meter, setMeter] = useState(null);
  const meterId = localStorage.getItem("meterId");

  useEffect(() => {
    if (!meterId) return;

    const ref = doc(db, "meters", meterId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMeter({ id: snap.id, ...snap.data() });
      }
    });

    return () => unsub();
  }, [meterId]);

  if (!meter) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const unitsNum = Number(meter.kwh || 0);
  const tariffNum = Number(meter.tariffRate || 5.5);
  const totalCost = unitsNum * tariffNum;
  const totalPaidNum = Number(meter.totalPaid || 0);
  const outstandingNum = Math.max(0, totalCost - totalPaidNum);

  const unitsConsumed = unitsNum.toFixed(2);
  const currentBill = outstandingNum.toFixed(2);
  const walletBalance = Number(meter.walletAmount || 0).toFixed(2);
  
  // Transform readings for the graph if available, otherwise empty
  const consumptionData = (meter.readings || []).slice(-7).map((r, i) => ({
    day: new Date(r.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    voltage: Number(r.voltage || 230),
    current: Number(r.current || 0),
    power: Number(r.power || 0)
  }));

  // If no readings, provide at least one point to avoid crash or empty logic
  if (consumptionData.length === 0) {
     consumptionData.push({ day: 'Now', voltage: 0, current: 0, power: 0 });
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">User Dashboard</h1>
      </div>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome, {meter.owner || "User"}!</h2>
          <p>Meter: {meterId}</p>
        </div>
        <button className="power-button">
            Power {meter.status === 'on' ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card blue">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Current Power Reading</p>
            <p className="metric-value">{meter.power || 0} W</p>
          </div>
        </div>

        <div className="metric-card orange">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Units Consumed</p>
            <p className="metric-value">{unitsConsumed} kWh</p>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12" />
              <path d="M6 8h12" />
              <path d="m6 13 8.5 8" />
              <path d="M6 13h3" />
              <path d="M9 13c6.667 0 6.667-10 0-10" />
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Current Bill</p>
            <p className="metric-value">₹{currentBill}</p>
            <p className={`metric-status ${Number(currentBill) > 0 ? 'pending' : 'paid'}`}>
              {Number(currentBill) > 0 ? 'Pending' : 'Paid'}
            </p>
          </div>
        </div>

        <div className="metric-card white">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Wallet Balance</p>
            <p className="metric-value">₹{walletBalance}</p>
          </div>
        </div>
      </div>

      {/* Consumption Graph */}
      <div className="graph-card">
        <h3 className="graph-title">Your Consumption</h3>
        <div className="graph-container">
          <div className="graph-y-axis">
            {[0, 500, 1000, 1500, 2000].map((val) => (
              <div key={val} className="y-axis-label">{val}</div>
            ))}
          </div>
          <div className="graph-content">
            <svg width="100%" height="300" viewBox="0 0 800 300" preserveAspectRatio="none" className="graph-svg">
              {/* Grid lines */}
              {[0, 500, 1000, 1500, 2000].map((val) => (
                <line
                  key={val}
                  x1="40"
                  y1={280 - (val / 2000) * 280}
                  x2="760"
                  y2={280 - (val / 2000) * 280}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.2"
                />
              ))}
              
              {/* Power line (green) */}
              <polyline
                points={consumptionData.map((d, i) => 
                  `${40 + (i * 720) / Math.max(1, consumptionData.length - 1)},${280 - (d.power / 2000) * 280}`
                ).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {consumptionData.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={40 + (i * 720) / Math.max(1, consumptionData.length - 1)}
                    cy={280 - (d.power / 2000) * 280}
                    r="4"
                    fill="#10b981"
                  />
                </g>
              ))}
            </svg>
            <div className="graph-x-axis">
              {consumptionData.map((d, i) => (
                <div key={i} className="x-axis-label">{d.day}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="graph-legend">
          <span className="legend-item">
            <span className="legend-color green"></span>
            Power (W)
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="info-card">
          <h3 className="info-title">Meter Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Voltage:</span>
              <span className="info-value">{meter.voltage || 0} V</span>
            </div>
            <div className="info-item">
              <span className="info-label">Power:</span>
              <span className="info-value">{meter.power || 0} W</span>
            </div>
            <div className="info-item">
              <span className="info-label">Current:</span>
              <span className="info-value">{meter.current || 0} A</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tariff Rate:</span>
              <span className="info-value">₹{meter.tariffRate || 5.5}/kWh</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-title">Recent Payments</h3>
          <div className="payment-list">
            {meter.payments && meter.payments.length > 0 ? (
                meter.payments.map((p, index) => (
                    <div key={index} className="payment-item">
                    <span className="payment-amount">₹{p.amount}</span>
                    <span className="payment-date">{p.date}</span>
                    <span className={`payment-status ${p.status}`}>{p.status}</span>
                    </div>
                ))
            ) : (
                <div className="no-data">No recent payments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
