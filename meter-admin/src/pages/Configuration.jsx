import Sidebar from "../components/Sidebar";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const SETTINGS_DOC = doc(db, "settings", "billing");

function Configuration() {
  const [tariff, setTariff] = useState("");
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /* ── Load from Firestore on mount ── */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snap = await getDoc(SETTINGS_DOC);
        if (snap.exists()) {
          const d = snap.data();
          setTariff(d.tariff?.toString() ?? "5.5");
          setMinutes(d.minutes?.toString() ?? "15");
        } else {
          setTariff("5.5");
          setMinutes("15");
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings from server.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  /* ── Save to Firestore ── */
  const handleSave = async () => {
    const t = parseFloat(tariff);
    const m = parseInt(minutes, 10);

    if (isNaN(t) || t <= 0) {
      setError("Please enter a valid tariff rate.");
      return;
    }
    if (isNaN(m) || m < 1) {
      setError("Please enter a valid payment window (minimum 1 minute).");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await setDoc(SETTINGS_DOC, {
        tariff: t,
        minutes: m,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <Sidebar />
        <div style={styles.loadingArea}>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.content}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.iconBox}>
            <Settings size={26} color="#1b9cfc" />
          </div>
          <h2 style={styles.title}>Configuration</h2>
          <p style={styles.subtitle}>Manage billing settings and tariffs</p>
        </div>

        {/* BILLING SETTINGS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Billing Settings</h3>
          <p style={styles.cardDesc}>
            Configure default values for new meters and billing. Changes are
            saved to the database and will persist across page refreshes.
          </p>

          <div style={styles.field}>
            <label style={styles.label}>Default Tariff Rate (per kWh)</label>
            <input
              type="number"
              value={tariff}
              onChange={(e) => setTariff(e.target.value)}
              style={styles.input}
              min="0"
              step="0.1"
            />
            <small style={styles.helper}>Applied to new meters by default</small>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Default Payment Window (Minutes)</label>
            <input
              type="number"
              min="1"
              max="1440"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              style={styles.input}
            />
            <small style={styles.helper}>
              Time window (in minutes) allowed for payment after bill is generated.
            </small>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

          {saved && (
            <p style={styles.savedMsg}>✅ Settings saved successfully.</p>
          )}
        </div>

        {/* PREVIEW */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Current Settings Preview</h3>

          <div style={styles.previewGrid}>
            <div style={{ ...styles.previewCard, background: "#eef2ff" }}>
              <p style={styles.previewLabel}>Tariff Rate</p>
              <h2 style={styles.previewValue}>₹{tariff || "0"}</h2>
              <span style={styles.previewSub}>per kWh</span>
            </div>

            <div style={{ ...styles.previewCard, background: "#e9f9ef" }}>
              <p style={styles.previewLabel}>Payment Window</p>
              <h2 style={styles.previewValue}>{minutes || "0"}</h2>
              <span style={styles.previewSub}>minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#f5f7fa" },
  content: { flex: 1, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" },
  loadingArea: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6c757d" },
  header: { textAlign: "center", marginBottom: "30px" },
  iconBox: { width: "50px", height: "50px", borderRadius: "12px", background: "#eaf3ff", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 10px" },
  title: { margin: 0 },
  subtitle: { color: "#6c757d", fontSize: "14px" },
  card: { background: "#fff", width: "100%", maxWidth: "520px", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "20px" },
  cardTitle: { marginBottom: "6px" },
  cardDesc: { fontSize: "14px", color: "#6c757d", marginBottom: "20px" },
  field: { marginBottom: "18px" },
  label: { display: "block", marginBottom: "6px", fontWeight: 500 },
  input: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" },
  helper: { fontSize: "12px", color: "#6c757d" },
  saveBtn: { padding: "10px 24px", background: "#1b9cfc", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "0.2s" },
  savedMsg: { marginTop: 12, fontSize: 14, color: "#155724", fontWeight: 500 },
  errorText: { color: "#d63031", fontSize: 14, marginBottom: 15, fontWeight: 500 },
  previewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" },
  previewCard: { padding: "18px", borderRadius: "10px" },
  previewLabel: { fontSize: "14px", color: "#6c757d", marginBottom: "6px" },
  previewValue: { margin: 0 },
  previewSub: { fontSize: "12px", color: "#6c757d" },
};

export default Configuration;
