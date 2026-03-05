import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, Tooltip, Legend);

export default function PowerChart() {
  const data = {
    labels: ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
    datasets: [
      {
        label: "Power (W)",
        data: [2000, 1500, 1100, 1800, 900, 1700, 1550],
        borderColor: "green",
      },
    ],
  };

  return <Line data={data} />;
}
