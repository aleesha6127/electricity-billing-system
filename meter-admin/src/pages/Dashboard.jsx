import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

import Sidebar from "../components/Sidebar";
import PowerGraph from "../components/PowerGraph";
import MeterTable from "../components/MeterTable";
import AddMeterModal from "../components/AddMeterModal";
import ViewMeterModal from "../components/ViewMeterModal";

function Dashboard() {
  const [meters, setMeters] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [viewMeter, setViewMeter] = useState(null);
  const [paymentWindow, setPaymentWindow] = useState(15); // Default 15 mins

  /* 🔥 REALTIME FIRESTORE (Meter ID = Firestore Document ID) */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "meters"), (snap) => {
      const data = snap.docs.map((d) => ({
        firestoreId: d.id, // ✅ Meter ID
        ...d.data(),
      }));
      setMeters(data);
    });

    return () => unsub();
  }, []);

  /* ⚙️ FETCH SETTINGS */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "billing"));
        if (snap.exists()) {
          setPaymentWindow(snap.data().minutes || 15);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  /* 🔎 SAFE SEARCH (Meter ID + Owner) */
  const filteredMeters = meters.filter((m) => {
    const id = m.firestoreId || "";
    const owner = m.owner || "";

    return (
      id.toLowerCase().includes(search.toLowerCase()) ||
      owner.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* 📊 SUMMARY */
  const totalMeters = meters.length;

  const activeMeters = meters.filter(
    (m) => (m.status || "").toLowerCase() === "on"
  ).length;

  const unpaidBills = meters.filter(
    (m) => (m.payment || "Unpaid") === "Unpaid"
  ).length;

  const totalPower =
    meters.reduce((sum, m) => sum + Number(m.power || 0), 0) / 1000;

  /* ⚙️ ACTIONS */
  const toggleStatus = async (firestoreId, status) => {
    await updateDoc(doc(db, "meters", firestoreId), {
      status: status.toLowerCase() === "on" ? "off" : "on",
    });
  };

  const payBill = async (firestoreId, amountToPay = 0) => {
    try {
      await updateDoc(doc(db, "meters", firestoreId), {
        payment: "Paid",
        amount: 0,
        totalPaid: increment(amountToPay || 0),
        paidOn: new Date().toISOString().split("T")[0],
        status: "on", // Restore power
        payments: arrayUnion({
          amount: amountToPay || 0,
          date: new Date().toISOString().split("T")[0],
          method: "Admin Manual",
          status: "completed",
        }),
      });
      alert("Payment updated successfully.");
    } catch (err) {
      console.error("Pay bill error:", err);
      alert("Failed to update payment.");
    }
  };



  const deleteMeter = async (firestoreId) => {
    if (window.confirm("Delete this meter?")) {
      await deleteDoc(doc(db, "meters", firestoreId));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1>Admin Dashboard</h1>
          <button style={styles.addBtn} onClick={() => setShowAdd(true)}>
            + Add Meter
          </button>
        </div>

        {/* SEARCH */}
        <input
          style={styles.search}
          placeholder="Search Meter ID / Owner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SUMMARY */}
        <div style={styles.cards}>
          <Card title="Total Meters" value={totalMeters} />
          <Card title="Active Meters" value={activeMeters} />
          <Card title="Unpaid Bills" value={unpaidBills} />
          <Card title="Total Power" value={`${totalPower.toFixed(2)} kW`} />
        </div>

        {/* 🔥 GLOBAL GRAPH */}
        <PowerGraph meters={meters} />

        {/* TABLE */}
        <MeterTable
          meters={filteredMeters}
          onToggleStatus={toggleStatus}
          onDelete={deleteMeter}
          onPay={(id) => {
            const m = meters.find(mtr => mtr.firestoreId === id);
            payBill(id, m?.amount || 0);
          }}
          onView={(meter) => setViewMeter(meter)}

          paymentWindow={paymentWindow}
        />
      </div>

      {/* MODALS */}
      {showAdd && <AddMeterModal onClose={() => setShowAdd(false)} />}

      {viewMeter && (
        <ViewMeterModal
          meter={viewMeter}
          onClose={() => setViewMeter(null)}
        />
      )}
    </div>
  );
}

/* CARD */
const Card = ({ title, value }) => (
  <div style={styles.card}>
    <p>{title}</p>
    <b>{value}</b>
  </div>
);

/* STYLES */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    padding: "10px 16px",
    background: "#1b9cfc",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  search: {
    margin: "16px 0",
    padding: "10px",
    width: "280px",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 20,
    margin: "20px 0",
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
  },
};

export default Dashboard;
