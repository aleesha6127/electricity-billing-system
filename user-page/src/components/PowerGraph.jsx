import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function PowerGraph({ readings }) {
  if (!readings || readings.length === 0) {
    return <p style={{ marginTop: 20 }}>No usage data available</p>;
  }

  const labels = readings.map((r) =>
    r.timestamp?.seconds
      ? new Date(r.timestamp.seconds * 1000).toLocaleDateString()
      : ""
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Power (W)",
        data: readings.map((r) => r.power),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Power Usage History</h3>
      <Line data={data} />
    </div>
  );
}

export default PowerGraph;
