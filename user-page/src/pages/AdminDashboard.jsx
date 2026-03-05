import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [meters, setMeters] = useState([]);

  const fetchMeters = async () => {
    const snapshot = await getDocs(collection(db, "meters"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMeters(data);
  };

  const toggleStatus = async (id, status) => {
    await updateDoc(doc(db, "meters", id), {
      status: status === "on" ? "off" : "on"
    });
    fetchMeters();
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {meters.map(m => (
        <div key={m.id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
          <h3>{m.id}</h3>
          <p>Voltage: {m.voltage}</p>
          <p>Current: {m.current}</p>
          <p>Power: {m.power}</p>
          <p>KWH: {m.kwh}</p>
          <p>Amount: ₹{m.amount}</p>
          <p>Wallet: ₹{m.walletAmount}</p>
          <p>Status: {m.status}</p>

          <button onClick={() => toggleStatus(m.id, m.status)}>
            Turn {m.status === "on" ? "OFF" : "ON"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
