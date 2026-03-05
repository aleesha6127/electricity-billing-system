import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function ViewMeterModal({ meter, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    owner: meter.owner || "",
    phone: meter.phone || "",
    address: meter.address || "",
    power: meter.power || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.owner.trim()) e.owner = "Owner is required";
    if (!/^\d{10}$/.test(form.phone))
      e.phone = "Phone must be exactly 10 digits";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.power || form.power <= 0)
      e.power = "Power must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    await updateDoc(doc(db, "meters", meter.firestoreId), {
      ...form,
      power: Number(form.power),
    });

    setIsEditing(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ marginBottom: 20 }}>Meter Details</h2>

        <div style={styles.grid}>
          <Field label="Meter ID" value={meter.id} disabled />

          <Field
            label="Owner"
            value={form.owner}
            disabled={!isEditing}
            error={errors.owner}
            onChange={(v) => setForm({ ...form, owner: v })}
          />

          <Field
            label="Phone"
            value={form.phone}
            disabled={!isEditing}
            error={errors.phone}
            onChange={(v) =>
              setForm({ ...form, phone: v.replace(/\D/g, "") })
            }
          />

          <Field
            label="Power (W)"
            type="number"
            value={form.power}
            disabled={!isEditing}
            error={errors.power}
            onChange={(v) => setForm({ ...form, power: v })}
          />

          <Field
            label="Address"
            value={form.address}
            disabled={!isEditing}
            error={errors.address}
            full
            onChange={(v) => setForm({ ...form, address: v })}
          />
        </div>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.btn}>
            Close
          </button>

          {!isEditing ? (
            <button
              style={{ ...styles.btn, ...styles.editBtn }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <button
              style={{ ...styles.btn, ...styles.saveBtn }}
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 FIELD COMPONENT */
const Field = ({
  label,
  value,
  onChange,
  disabled,
  error,
  type = "text",
  full,
}) => (
  <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        ...styles.input,
        background: disabled ? "#f2f2f2" : "#fff",
        borderColor: error ? "red" : "#ccc",
      }}
    />
    {error && <div style={styles.error}>{error}</div>}
  </div>
);

/* 🎨 STYLES */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: 28,
    width: 560,
    borderRadius: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px 20px",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
  },
  btn: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },
  editBtn: {
    background: "#f39c12",
    color: "#fff",
  },
  saveBtn: {
    background: "#1b9cfc",
    color: "#fff",
  },
};

export default ViewMeterModal;
