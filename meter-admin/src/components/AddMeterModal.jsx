import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function AddMeterModal({ onClose }) {
  const [form, setForm] = useState({
    owner: "",
    phone: "",
    address: "",
    tariff: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableIds, setAvailableIds] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  /* ======================
     GENERATE AVAILABLE IDS
  ====================== */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "meters"), (snap) => {
      const assigned = new Set(snap.docs.map((d) => d.id));
      const pad = (n) => `MTR-${String(n).padStart(4, "0")}`;
      const avail = [];

      for (let i = 1; i <= 9999 && avail.length < 50; i++) {
        const id = pad(i);
        if (!assigned.has(id)) avail.push(id);
      }

      setAvailableIds(avail);
      setSelectedId((prev) => prev || avail[0] || pad(1));
    });

    return () => unsub();
  }, []);

  /* ======================
     VALIDATION
  ====================== */
  const validate = () => {
    const err = {};

    if (!form.owner || !/^[A-Za-z ]{3,}$/.test(form.owner))
      err.owner = "Enter a valid owner name";

    if (!/^[0-9]{10}$/.test(form.phone))
      err.phone = "Phone must be 10 digits";

    if (!form.address || form.address.length < 5)
      err.address = "Address too short";

    if (!form.tariff || Number(form.tariff) <= 0)
      err.tariff = "Invalid tariff";

    return err;
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      await setDoc(doc(db, "meters", selectedId), {
        /* BASIC INFO */
        owner: form.owner,
        phone: form.phone,
        address: form.address,

        /* 🔥 ELECTRICAL VALUES (ADMIN / FIREBASE CONTROLLED) */
        power: 0,
        voltage: 0,
        current: 0,

        /* TARIFF */
        tariff: Number(form.tariff),

        /* BILLING */
        kwh: 0,              // 🔥 You can edit this manually in Firebase
        amount: 0,
        walletAmount: 0,

        /* FLAGS */
        kwhAuto: false,      // 🔥 IMPORTANT: no auto overwrite
        status: "off",
        payment: "Paid",

        /* DATES */
        createdAt: now,
        billingPeriodStart: now,
        billingPeriodEnd: new Date(year, month + 1, 0),
        nextDueDate: new Date(year, month + 1, 1),
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add meter");
    }

    setLoading(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Add New Meter</h2>

        {/* Meter ID */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 600 }}>Meter ID</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={inputStyle}
          >
            {availableIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <Input
          placeholder="Owner Name"
          value={form.owner}
          onChange={(v) => setForm({ ...form, owner: v })}
          error={errors.owner}
        />

        <Input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          error={errors.phone}
        />

        <Input
          placeholder="Address"
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
          error={errors.address}
        />

        {/* CONNECTED LOAD REMOVED AS REQUESTED */}

        <Input
          placeholder="Tariff (₹/kWh)"
          type="number"
          value={form.tariff}
          onChange={(v) => setForm({ ...form, tariff: v })}
          error={errors.tariff}
        />

        <button style={addBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Meter"}
        </button>

        <button style={cancelBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* INPUT */
const Input = ({ placeholder, value, onChange, error, type = "text" }) => (
  <div style={{ marginBottom: 14 }}>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: 6,
        border: error ? "1px solid red" : "1px solid #ccc",
      }}
    />
    {error && <small style={{ color: "red" }}>{error}</small>}
  </div>
);

/* STYLES */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 30,
  width: 450,
  borderRadius: 10,
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #ccc",
};

const addBtn = {
  width: "100%",
  padding: 12,
  background: "#1b9cfc",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer",
};

const cancelBtn = {
  width: "100%",
  padding: 10,
  background: "#eee",
  border: "none",
  borderRadius: 6,
  marginTop: 8,
  cursor: "pointer",
};

export default AddMeterModal;
