import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));
  }, []);

  if (!stats) {
    return <h1>Loading...</h1>;
  }

  const chartData = [
    { name: "TCP", value: stats.TCP },
    { name: "UDP", value: stats.UDP },
    { name: "ICMP", value: stats.ICMP },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        AI Wireless Network Monitor
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <div style={cardStyle}>
          <h2>Total</h2>
          <h1>{stats.TOTAL}</h1>
        </div>

        <div style={cardStyle}>
          <h2>TCP</h2>
          <h1>{stats.TCP}</h1>
        </div>

        <div style={cardStyle}>
          <h2>UDP</h2>
          <h1>{stats.UDP}</h1>
        </div>

        <div style={cardStyle}>
          <h2>ICMP</h2>
          <h1>{stats.ICMP}</h1>
        </div>
      </div>

      <div
        style={{
          width: "500px",
          height: "400px",
          margin: "40px auto",
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={140}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "15px",
  width: "180px",
  textAlign: "center",
};

export default App;