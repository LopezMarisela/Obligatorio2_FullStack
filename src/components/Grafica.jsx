import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);


const Grafica = ({ etiquetas, datos, nombreGrafica, nombreDatos }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: nombreGrafica || "Gráfica" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: nombreDatos || "Datos",
        data: datos,
        backgroundColor: "#2f5d46",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default Grafica;
