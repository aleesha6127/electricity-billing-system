import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "./UserDashboard.css";

export default function Profile() {
  const navigate = useNavigate();
  const meterId = localStorage.getItem("meterId");
  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [tariff, setTariff] = useState("");

  useEffect(() => {
    if (!meterId) {
      navigate("/");
      return;
    }
    const ref = doc(db, "meters", meterId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setMeter(data);
          setOwner(data.owner ?? "");
          setPhone(String(data.phone ?? ""));
          setTariff(String(data.tariff ?? data.tariffRate ?? ""));
        } else {
          alert("Meter not found");
          navigate("/");
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [meterId, navigate]);

  const save = async () => {
    await updateDoc(doc(db, "meters", meterId), {
      owner: owner || "User",
    });
    alert("Profile updated");
  };

  const logout = () => {
    localStorage.removeItem("meterId");
    navigate("/");
  };

  if (loading) return <div style={{ padding: 30 }}>Loading profile...</div>;
  if (!meter) return <div style={{ padding: 30 }}>No meter data</div>;

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      <main className="main-content">
        <div className="welcome-banner">
          <div>
            <h1>Profile</h1>
            <p>Meter ID: {meterId}</p>
          </div>
        </div>

        <div className="details-section">
          <div className="info-card">
            <h3>Account</h3>
            <div className="info-row">
              <span>Name</span>
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={{ width: 250, padding: 8, borderRadius: 8, border: "1px solid #1f2937", background: "#0b1220", color: "#e5e7eb" }}
              />
            </div>
            <div className="info-row">
              <span>Phone</span>
              <input
                value={phone}
                disabled
                style={{ width: 250, padding: 8, borderRadius: 8, border: "1px solid #1f2937", background: "#0b1220", color: "#94a3b8" }}
              />
            </div>
            <div className="info-row">
              <span>Tariff (₹/kWh)</span>
              <input
                value={tariff}
                disabled
                style={{ width: 120, padding: 8, borderRadius: 8, border: "1px solid #1f2937", background: "#0b1220", color: "#94a3b8" }}
              />
            </div>
            <button className="power-button" onClick={save} style={{ marginTop: 12 }}>
              Save Changes
            </button>
          </div>

          <div className="info-card">
            <h3>Meter Summary</h3>
            <div className="info-row">
              <span>Owner</span>
              <strong>{meter.owner || "User"}</strong>
            </div>
            <div className="info-row">
              <span>Phone</span>
              <strong>{meter.phone}</strong>
            </div>
            <div className="info-row">
              <span>Tariff</span>
              <strong>₹{Number(meter.tariff ?? meter.tariffRate ?? 0)}/kWh</strong>
            </div>
            <div className="info-row">
              <span>Status</span>
              <strong>{meter.status}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
