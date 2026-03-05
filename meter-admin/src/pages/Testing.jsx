import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
    doc, getDoc, updateDoc,
    collection, addDoc, getDocs,
    query, orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import { FlaskConical } from "lucide-react";

function Testing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [meterId, setMeterId] = useState(searchParams.get("id") || "");
    const [meter, setMeter] = useState(null);
    const [history, setHistory] = useState([]);   // bill history rows
    const [notFound, setNotFound] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    /* ── Fetch bill history for a meter ── */
    const fetchHistory = useCallback(async (id) => {
        try {
            const q = query(collection(db, "meters", id, "billHistory"), orderBy("generatedAt", "desc"));
            const snap = await getDocs(q);
            setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch {
            setHistory([]);
        }
    }, []);

    /* ── Search Function ── */
    const handleSearch = useCallback(async (idToSearch) => {
        const id = (idToSearch || meterId).trim();
        if (!id) return;

        setMeter(null);
        setHistory([]);
        setNotFound(false);
        setResult(null);
        setAmount("");

        try {
            const snap = await getDoc(doc(db, "meters", id));
            if (snap.exists()) {
                setMeter({ firestoreId: snap.id, ...snap.data() });
                await fetchHistory(snap.id);
                // Sync with URL
                setSearchParams({ id });
            } else {
                setNotFound(true);
            }
        } catch (err) {
            console.error("Search error:", err);
        }
    }, [meterId, fetchHistory, setSearchParams]);

    /* ── Auto-search on mount if ID is in URL ── */
    useEffect(() => {
        const idFromUrl = searchParams.get("id");
        if (idFromUrl) {
            handleSearch(idFromUrl);
        }
    }, []); // Only run once on mount

    /* ── Generate Bill ── */
    const handleGenerate = async () => {
        if (!meter) return;
        const amtNum = parseFloat(amount);
        if (!amount || isNaN(amtNum) || amtNum <= 0) {
            setResult({ type: "error", msg: "Please enter a valid amount greater than 0." });
            return;
        }

        setLoading(true);
        setResult(null);
        const now = new Date();
        const dateStr = now.toISOString().split("T")[0];
        const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

        try {
            // Update the main meter document
            await updateDoc(doc(db, "meters", meter.firestoreId), {
                amount: amtNum,
                payment: "Unpaid",
                billGeneratedOn: dateStr,
                billGeneratedAt: now.toISOString(), // ISO timestamp for gating logic
            });

            // Add a record to the billHistory subcollection
            await addDoc(collection(db, "meters", meter.firestoreId, "billHistory"), {
                amount: amtNum,
                payment: "Unpaid",
                generatedAt: now.toISOString(),   // used for ordering
                date: dateStr,
                time: timeStr,
            });

            // Refresh local state
            const updated = {
                ...meter,
                amount: amtNum,
                payment: "Unpaid",
                billGeneratedOn: dateStr,
                billGeneratedAt: now.toISOString(),
            };
            setMeter(updated);
            await fetchHistory(meter.firestoreId);

            setResult({ type: "success", msg: `Bill of ₹${amtNum.toFixed(2)} generated. Status set to OFF until payment is received.` });
            setAmount("");
        } catch (err) {
            setResult({ type: "error", msg: "Failed to generate bill. " + err.message });
        }
        setLoading(false);
    };

    return (
        <div style={s.wrapper}>
            <Sidebar />

            <div style={s.content}>
                {/* HEADER */}
                <div style={s.header}>
                    <div style={s.iconBox}>
                        <FlaskConical size={26} color="#1b9cfc" />
                    </div>
                    <h2 style={s.title}>Meter Testing</h2>
                    <p style={s.subtitle}>Search a meter, inspect its details, and generate a bill manually.</p>
                </div>

                {/* SEARCH CARD */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>Search Meter</h3>
                    <div style={s.searchRow}>
                        <input
                            style={s.searchInput}
                            placeholder="Enter Meter ID (e.g. MTR001)"
                            value={meterId}
                            onChange={(e) => setMeterId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button style={s.searchBtn} onClick={() => handleSearch()}>Search</button>
                    </div>
                    {notFound && (
                        <p style={s.errorMsg}>⚠️ No meter found with ID "{meterId.trim()}".</p>
                    )}
                </div>

                {meter && (
                    <>
                        {/* METER DETAILS */}
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Meter Details</h3>
                            <div style={s.detailGrid}>
                                <DetailRow label="Meter ID" value={meter.firestoreId} />
                                <DetailRow label="Owner" value={meter.owner || "—"} />
                                <DetailRow label="Phone" value={meter.phone || "—"} />
                                <DetailRow label="Address" value={meter.address || "—"} full />
                                <DetailRow label="Power (W)" value={meter.power ?? "—"} />
                                <DetailRow label="kWh" value={Number(meter.kwh || 0).toFixed(2)} />
                                <DetailRow
                                    label="Status"
                                    value={
                                        <span style={{
                                            ...s.badge,
                                            background: (meter.status || "").toLowerCase() === "on" ? "#d4edda" : "#f8d7da",
                                            color: (meter.status || "").toLowerCase() === "on" ? "#155724" : "#721c24",
                                        }}>
                                            {(meter.status || "off").toUpperCase()}
                                        </span>
                                    }
                                />
                                <DetailRow
                                    label="Payment"
                                    value={
                                        <span style={{
                                            ...s.badge,
                                            background: meter.payment === "Paid" ? "#d4edda" : "#fff3cd",
                                            color: meter.payment === "Paid" ? "#155724" : "#856404",
                                        }}>
                                            {meter.payment || "Unpaid"}
                                        </span>
                                    }
                                />
                                <DetailRow label="Current Amount (₹)" value={Number(meter.amount || 0).toFixed(2)} />
                                <DetailRow label="Bill Generated On" value={meter.billGeneratedOn || "—"} />
                            </div>
                        </div>

                        {/* BILL GENERATION */}
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Generate Bill</h3>
                            <p style={s.cardDesc}>
                                Enter the bill amount manually. Generating a bill will mark the payment as
                                <strong> Unpaid</strong> and set meter status to <strong>OFF</strong>.
                            </p>
                            <div style={s.searchRow}>
                                <span style={s.rupee}>₹</span>
                                <input
                                    style={{ ...s.searchInput, borderRadius: "0 6px 6px 0", borderLeft: "none" }}
                                    type="number"
                                    min="0"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                />
                                <button
                                    style={{ ...s.searchBtn, background: loading ? "#aaa" : "#e74c3c" }}
                                    onClick={handleGenerate}
                                    disabled={loading}
                                >
                                    {loading ? "Saving…" : "Generate Bill"}
                                </button>
                            </div>

                            {result && (
                                <div style={{
                                    ...s.banner,
                                    background: result.type === "success" ? "#d4edda" : "#f8d7da",
                                    color: result.type === "success" ? "#155724" : "#721c24",
                                    borderColor: result.type === "success" ? "#c3e6cb" : "#f5c6cb",
                                }}>
                                    {result.type === "success" ? "✅" : "❌"} {result.msg}
                                </div>
                            )}
                        </div>

                        {/* BILL HISTORY */}
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Bill History</h3>
                            <p style={s.cardDesc}>All bills generated for meter <strong>{meter.firestoreId}</strong>.</p>

                            {history.length === 0 ? (
                                <p style={{ color: "#6c757d", fontSize: 14 }}>No bills have been generated yet.</p>
                            ) : (
                                <table style={s.table}>
                                    <thead>
                                        <tr style={s.thead}>
                                            <th style={s.th}>#</th>
                                            <th style={s.th}>Date</th>
                                            <th style={s.th}>Time</th>
                                            <th style={s.th}>Amount (₹)</th>
                                            <th style={s.th}>Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((h, i) => (
                                            <tr key={h.id} style={i % 2 === 0 ? s.rowEven : s.rowOdd}>
                                                <td style={s.td}>{i + 1}</td>
                                                <td style={s.td}>{h.date || "—"}</td>
                                                <td style={s.td}>{h.time || "—"}</td>
                                                <td style={s.td}>₹{Number(h.amount || 0).toFixed(2)}</td>
                                                <td style={s.td}>
                                                    <span style={{
                                                        ...s.badge,
                                                        background: h.payment === "Paid" ? "#d4edda" : "#fff3cd",
                                                        color: h.payment === "Paid" ? "#155724" : "#856404",
                                                        fontSize: 12,
                                                    }}>
                                                        {h.payment || "Unpaid"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Detail Row helper ── */
const DetailRow = ({ label, value, full }) => (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
        <p style={s.detailLabel}>{label}</p>
        <div style={s.detailValue}>{value}</div>
    </div>
);

/* ── Styles ── */
const s = {
    wrapper: { display: "flex", minHeight: "100vh", background: "#f5f7fa" },
    content: { flex: 1, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" },
    header: { textAlign: "center", marginBottom: "30px" },
    iconBox: { width: 50, height: 50, borderRadius: 12, background: "#eaf3ff", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 10px" },
    title: { margin: 0 },
    subtitle: { color: "#6c757d", fontSize: 14 },

    card: { background: "#fff", width: "100%", maxWidth: 620, padding: 25, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 20 },
    cardTitle: { margin: "0 0 8px", fontSize: 18 },
    cardDesc: { fontSize: 14, color: "#6c757d", marginBottom: 16 },

    searchRow: { display: "flex", alignItems: "stretch", gap: 0 },
    searchInput: { flex: 1, padding: "10px 12px", borderRadius: "6px 0 0 6px", border: "1px solid #ccc", fontSize: 14, outline: "none" },
    searchBtn: { padding: "10px 18px", background: "#1b9cfc", color: "#fff", border: "none", borderRadius: "0 6px 6px 0", cursor: "pointer", fontWeight: 600, fontSize: 14 },
    rupee: { display: "flex", alignItems: "center", padding: "0 10px", background: "#f2f2f2", border: "1px solid #ccc", borderRight: "none", borderRadius: "6px 0 0 6px", fontWeight: 700, fontSize: 16 },

    errorMsg: { color: "#e74c3c", marginTop: 10, fontSize: 14 },

    detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" },
    detailLabel: { margin: "0 0 4px", fontSize: 12, color: "#6c757d", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
    detailValue: { fontSize: 15, fontWeight: 500, color: "#212529" },

    badge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700 },
    banner: { marginTop: 16, padding: "12px 16px", borderRadius: 8, border: "1px solid", fontSize: 14, fontWeight: 500 },

    /* History table */
    table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
    thead: { background: "#f0f4ff" },
    th: { padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" },
    td: { padding: "10px 12px", borderBottom: "1px solid #f0f0f0" },
    rowEven: { background: "#fff" },
    rowOdd: { background: "#fafbff" },
};

export default Testing;

