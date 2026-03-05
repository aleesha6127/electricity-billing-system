import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "./UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const meterId = localStorage.getItem("meterId");

  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔥 REALTIME FIRESTORE — READ ONLY */
  useEffect(() => {
    if (!meterId) {
      navigate("/");
      return;
    }

    const ref = doc(db, "meters", meterId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          alert("Meter not found");
          navigate("/");
          return;
        }

        const data = snap.data();
        setMeter({
          ...data,
          payments: Array.isArray(data.payments) ? data.payments : [],
        });

        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [meterId, navigate]);

  /* 🚪 LOGOUT */
  const logout = () => {
    localStorage.removeItem("meterId");
    navigate("/");
  };

  /* 🔄 LOADING */
  if (loading) {
    return <h2 style={{ padding: 30 }}>Loading dashboard...</h2>;
  }

  if (!meter) {
    return <h2 style={{ padding: 30 }}>No meter data available</h2>;
  }

  /* 🔢 VALUES DIRECTLY FROM FIREBASE */
  const power = Number(meter.power ?? 0);
  const voltage = Number(meter.voltage ?? 0);
  const current = Number(meter.current ?? 0);
  const units = Number(meter.kwh ?? 0);     // 🔥 THIS WILL UPDATE
  const tariff = Number(meter.tariff ?? 0);
  const totalPaid = Number(meter.totalPaid ?? 0);
  const wallet = Number(meter.walletAmount ?? 0);

  const currentDue = meter.payment === "Unpaid" ? (Number(meter.amount) || 0) : Math.max(0, units * tariff - totalPaid);

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      {/* MAIN */}
      <main className="main-content">
        {/* HEADER */}
        <div className="welcome-banner">
          <div>
            <h1>Welcome, {meter.owner || "User"}!</h1>
            <p>Meter ID: {meterId}</p>
          </div>

          <button
            className={`power-button ${meter.status === "off" ? "off" : ""}`}
          >
            POWER {meter.status === "on" ? "ON" : "OFF"}
          </button>
        </div>

        {/* METRICS */}
        <div className="metrics-grid">
          <Metric title="Power (W)" value={power} />
          <Metric title="Units (kWh)" value={units.toFixed(2)} />
          <Metric title="Current Bill (₹)" value={currentDue.toFixed(2)} />
          <Metric title="Wallet Balance (₹)" value={wallet.toFixed(2)} />
        </div>

        {/* DETAILS */}
        <div className="details-section">
          <div className="info-card">
            <h3>Meter Information</h3>
            <Info label="Voltage" value={`${voltage} V`} />
            <Info label="Power" value={`${power} W`} />
            <Info label="Current" value={`${current} A`} />
            <Info label="Tariff" value={`₹${tariff}/kWh`} />

            <p style={{ marginTop: 12, color: "#94a3b8" }}>
              🔥 kWh, Voltage, Power update live from Firebase.
            </p>
          </div>

          <div className="info-card">
            <h3>Recent Payments</h3>
            {meter.payments.length > 0 ? (
              meter.payments.map((p, i) => (
                <div key={i} className="payment-item">
                  <span>₹{p.amount}</span>
                  <span>{p.date}</span>
                  <span>{p.status}</span>
                </div>
              ))
            ) : (
              <p>No recent payments</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* SMALL COMPONENTS */
const Metric = ({ title, value }) => (
  <div className="metric-card">
    <p>{title}</p>
    <h3>{value}</h3>
  </div>
);

const Info = ({ label, value }) => (
  <div className="info-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
