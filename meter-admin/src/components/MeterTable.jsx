function MeterTable({ meters, onToggleStatus, onDelete, onView, paymentWindow }) {
  const isWithinGracePeriod = (meter) => {
    if (meter.payment === "Paid") return false;
    if (!meter.billGeneratedAt) return false;

    const generatedTime = new Date(meter.billGeneratedAt).getTime();
    const now = new Date().getTime();
    const windowMs = paymentWindow * 60 * 1000;

    return now - generatedTime < windowMs;
  };

  return (
    <table border="1" width="100%" cellPadding="8">
      <thead>
        <tr>
          <th>Meter ID</th>
          <th>Owner</th>
          <th>Power (W)</th>
          <th>Status</th>
          <th>Payment</th>
          <th>kWh</th>
          <th>Amount (₹)</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {meters.map((m) => {
          const locked = isWithinGracePeriod(m);
          return (
            <tr key={m.firestoreId}>
              <td>{m.firestoreId}</td>
              <td>{m.owner || "-"}</td>
              <td>{m.power || 0}</td>

              <td>{(m.status || "").toUpperCase()}</td>

              <td
                style={{
                  color: m.payment === "Paid" ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {m.payment || "Unpaid"}
              </td>

              <td>{Number(m.kwh || 0).toFixed(2)}</td>

              <td>{Number(m.amount || 0).toFixed(2)}</td>

              <td>
                <button onClick={() => onView(m)} title="View/Edit Details">
                  👁️
                </button>
                <button
                  onClick={() => onToggleStatus(m.firestoreId, m.status)}
                  disabled={locked}
                  style={{
                    opacity: locked ? 0.4 : 1,
                    cursor: locked ? "not-allowed" : "pointer",
                  }}
                  title={
                    locked
                      ? `Status update locked during payment window (${paymentWindow} mins)`
                      : "Toggle Status"
                  }
                >
                  🔌
                </button>
                <button
                  onClick={() => onDelete(m.firestoreId)}
                  title="Delete Meter"
                >
                  🗑️
                </button>
              </td>
            </tr>
          );
        })}

        {meters.length === 0 && (
          <tr>
            <td colSpan="8" align="center">
              No meters found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default MeterTable;
