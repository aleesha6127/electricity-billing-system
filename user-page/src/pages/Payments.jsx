import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "../components/Payments.css";
import "./UserDashboard.css";

export default function Payments() {
  const navigate = useNavigate();
  const meterId = localStorage.getItem("meterId");

  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const getToday = () => new Date().toISOString().split("T")[0];

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
          setMeter({ id: snap.id, ...snap.data() });
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

  if (loading) return <div style={{ padding: 30 }}>Loading payments...</div>;
  if (!meter) return <div style={{ padding: 30 }}>No meter data</div>;

  const units = Number(meter.kwh ?? 0);
  const tariffRate = Number(meter.tariff ?? meter.tariffRate ?? 5.5);
  const totalPaid = Number(meter.totalPaid ?? 0);
  const wallet = Number(meter.walletAmount ?? 0);
  const currentBill = meter.payment === "Unpaid" ? (Number(meter.amount) || 0) : Math.max(0, units * tariffRate - totalPaid);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const amt = Number(addAmount);
    setProcessing(true);
    try {
      await updateDoc(doc(db, "meters", meterId), {
        walletAmount: increment(amt),
        payments: arrayUnion({
          amount: amt,
          date: getToday(),
          method: "Card",
          status: "completed",
        }),
      });
      setAddAmount("");
      alert("Funds added successfully!");
    } catch (err) {
      console.error("Add funds error:", err);
      alert("Failed to add funds. Please check your connection.");
    } finally {
      setProcessing(false);
    }
  };


  const handlePayBill = async () => {
    if (currentBill <= 0) return;
    if (wallet < currentBill) {
      alert(`Insufficient wallet balance. Need ₹${(currentBill - wallet).toFixed(2)}`);
      return;
    }

    setProcessing(true);
    try {
      await updateDoc(doc(db, "meters", meterId), {
        walletAmount: increment(-currentBill),
        totalPaid: increment(currentBill),
        payment: "Paid",
        amount: 0,
        status: "on", // Automatically restore power
        paidOn: getToday(),
        payments: arrayUnion({
          amount: currentBill,
          date: getToday(),
          method: "Wallet",
          status: "completed",
        }),
      });
      alert("Bill paid successfully! Your power is now ON.");
    } catch (err) {
      console.error("Pay bill error:", err);
      alert("Failed to pay bill. Please check your connection.");
    } finally {
      setProcessing(false);
    }
  };




  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <main className="main-content">
        <div className="payments">
          <div className="payments-header">
            <h1 className="payments-title">Payments</h1>
          </div>

          <div className="summary-cards">
            <div className="summary-card wallet">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div className="summary-content">
                <p className="summary-label">Wallet Balance</p>
                <p className="summary-value">₹{wallet.toFixed(2)}</p>
              </div>
            </div>

            <div className="summary-card bill">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="summary-content">
                <p className="summary-label">Current Bill</p>
                <p className="summary-value">₹{currentBill.toFixed(2)}</p>
                <p className={`summary-status ${currentBill > 0 ? "pending" : "paid"}`}>
                  {currentBill > 0 ? "Pending" : "Paid"}
                </p>
              </div>
            </div>

            <div className="summary-card total">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="summary-content">
                <p className="summary-label">Total Paid</p>
                <p className="summary-value">₹{totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="action-sections">
            <div className="action-card">
              <div className="action-content">
                <div className="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div className="action-text">
                  <h3>Add Funds</h3>
                  <p>Top up your wallet balance</p>
                </div>
              </div>
              <form onSubmit={handleAddFunds}>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Amount (₹)"
                  style={{ marginRight: 8, padding: 8, borderRadius: 8, border: "1px solid #1f2937" }}
                />
                <button className="action-button add" type="submit" disabled={processing}>
                  {processing ? "..." : "Add"}
                </button>
              </form>

            </div>

            <div className="action-card">
              <div className="action-content">
                <div className="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="action-text">
                  <h3>Pay Bill</h3>
                  <p>{currentBill > 0 ? `Amount: ₹${currentBill.toFixed(2)}` : "No pending bills"}</p>
                </div>
              </div>
              <button
                className={`action-button pay ${currentBill <= 0 || processing ? "disabled" : ""}`}
                onClick={handlePayBill}
                disabled={currentBill <= 0 || processing}
              >
                {processing ? "Paying..." : "Pay"}
              </button>

            </div>
          </div>

          <div className="payment-history-card">
            <div className="history-header">
              <div className="history-title-section">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h2 className="history-title">Payment History</h2>
              </div>
            </div>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(meter.payments) && meter.payments.length > 0 ? (
                    meter.payments.map((p, i) => (
                      <tr key={i}>
                        <td>{p.date}</td>
                        <td className="amount-cell">₹{Number(p.amount).toFixed(2)}</td>
                        <td>{p.method}</td>
                        <td>
                          <span className={`status-badge ${p.status}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "#94a3b8" }}>No payments yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
