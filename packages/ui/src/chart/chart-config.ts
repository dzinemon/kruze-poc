import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const colorSchemes = {
  brand: ["#2F74B2", "#02ABE3", "#024D7C", "#4791CE", "#9B9B9B", "#59595b"],
  warm: ["#fd7e14", "#ffc107", "#D9534F", "#F0AD4E", "#e83e8c", "#dc3545"],
  cool: ["#02ABE3", "#20c997", "#6610f2", "#2F74B2", "#6f42c1", "#17a2b8"],
  mono: ["#212529", "#495057", "#6c757d", "#adb5bd", "#dee2e6", "#f8f9fa"],
};
