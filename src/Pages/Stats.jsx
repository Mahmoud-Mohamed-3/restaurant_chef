import { useEffect, useState } from "react";
import { GetChefStatsApi } from "../API Calls/Stats/GetChefStats.jsx";
import { useCookies } from "react-cookie";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../css/stats.css";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [cookies] = useCookies();

  useEffect(() => {
    const getStats = async () => {
      const response = await GetChefStatsApi(cookies.jwt);
      if (response) {
        setStats(response.data);
      } else {
        console.error("Failed to get stats");
      }
    };
    getStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const orderCountData = {
    labels: Object.keys(stats.ordered_item_and_count),
    datasets: [
      {
        label: "Orders per Item",
        data: Object.values(stats.ordered_item_and_count),
        backgroundColor: "#ff6600",
      },
    ],
  };

  const revenueData = {
    labels: Object.keys(stats.ordered_item_and_revenue),
    datasets: [
      {
        label: "Revenue per Item",
        data: Object.values(stats.ordered_item_and_revenue),
        backgroundColor: [
          "#ff6600",
          "#ff9900",
          "#ff3300",
          "#cc5500",
          "#66cc00",
          "#0099ff",
        ],
      },
    ],
  };

  // Create chart data for average time per order item (Bar chart)
  const avgTimeData = {
    labels: [],
    datasets: [
      {
        label: "Avg Time per Item (seconds)",
        data: [],
        backgroundColor: "#ff6600",
      },
    ],
  };

  stats.av_time_per_order_item.forEach((item) => {
    const itemName = Object.keys(item)[0];
    const [hours, minutes, seconds] = item[itemName].split(":").map(Number);
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds; // Convert time to seconds
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    avgTimeData.labels.push(itemName);
    avgTimeData.datasets[0].data.push(timeInSeconds); // Store raw time in seconds
  });

  // Tooltip configuration
  const options = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          const timeInSeconds = tooltipItem.raw; // Get raw time in seconds
          const hours = Math.floor(timeInSeconds / 3600);
          const minutes = Math.floor((timeInSeconds % 3600) / 60);
          const seconds = timeInSeconds % 60;
          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          return `Time: ${formattedTime}`; // Display the formatted time
        },
      },
    },
  };

  return (
    <div className="stats-container">
      <h1>Chef Dashboard - Your Culinary Insights</h1>

      <div className="summary">
        <div className="box highlight">
          <h2>🔥 Total Orders</h2>
          <p>{stats.total_orders} meals served!</p>
          <p className="motivational">You're on fire! Keep going!</p>
        </div>
        <div className="box highlight">
          <h2>💰 Total Revenue</h2>
          <p>{stats.total_revenue} LE in earnings!</p>
          <p className="motivational">You're cooking up profits!</p>
        </div>
        <div className="box highlight">
          <h2>📈 Avg Order Price</h2>
          <p>{stats.av_order_price.toFixed(2)} LE per meal</p>
          <p className="motivational">You're serving up quality!</p>
        </div>
        <div className="box highlight">
          <h2>⏳ Avg Order Time</h2>
          <p>{stats.av_order_time} processing time</p>
          <p className="motivational">You're getting faster!</p>
        </div>
      </div>

      <div className="ordered-items-cards">
        <div className="card">
          <h3>🍔 Most Ordered Item</h3>
          <img
            src={stats.most_ordered_item.image_url}
            alt={stats.most_ordered_item.name}
          />
          <h4>{stats.most_ordered_item.name}</h4>
        </div>

        <div className="card">
          <h3>🍟 Least Ordered Item</h3>
          <img
            src={stats.less_ordered_item.image_url}
            alt={stats.less_ordered_item.name}
          />
          <h4>{stats.less_ordered_item.name}</h4>
        </div>
      </div>

      <div className="charts">
        <div className={"YourCharts"}>
          <h2>Your Culinary Charts</h2>
        </div>
        <div className="chart-box">
          <h3>🍽 Orders Per Item</h3>
          <Bar data={orderCountData} />
        </div>
        <div className="chart-box">
          <h3>💸 Revenue Breakdown</h3>
          <Pie data={revenueData} />
        </div>
        <div className="chart-box">
          <h3>⏰ Average Time Per Item</h3>
          <Bar data={avgTimeData} options={options} />
        </div>
      </div>
    </div>
  );
}
