import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function App() {
  const [stats, setStats] = useState(null);
  const [sourceIps, setSourceIps] = useState([]);
  const [destinationIps, setDestinationIps] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [recentPackets, setRecentPackets] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:8000/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);

      fetch("http://127.0.0.1:8000/top-source-ips")
        .then((res) => res.json())
        .then((data) => setSourceIps(data))
        .catch(console.error);

      fetch("http://127.0.0.1:8000/top-destination-ips")
        .then((res) => res.json())
        .then((data) => setDestinationIps(data))
        .catch(console.error);

      fetch("http://127.0.0.1:8000/anomalies")
        .then((res) => res.json())
        .then((data) => setAnomalies(data))
        .catch(console.error);

      fetch("http://127.0.0.1:8000/recent-packets")
        .then((res) => res.json())
        .then((data) => setRecentPackets(data))
        .catch(console.error);
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "32px",
        }}
      >
        Loading...
      </div>
    );
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
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "48px",
        }}
      >
        AI Wireless Network Monitor
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        🔄 Auto Refresh Every 5 Seconds
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "25px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total</h3>
          <h1>{stats.TOTAL}</h1>
        </div>

        <div style={cardStyle}>
          <h3>TCP</h3>
          <h1>{stats.TCP}</h1>
        </div>

        <div style={cardStyle}>
          <h3>UDP</h3>
          <h1>{stats.UDP}</h1>
        </div>

        <div style={cardStyle}>
          <h3>ICMP</h3>
          <h1>{stats.ICMP}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Threats</h3>
          <h1>{anomalies.length}</h1>
        </div>
      </div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Protocol Distribution
      </h2>

      <div
        style={{
          width: "500px",
          height: "400px",
          margin: "20px auto",
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

      <h2 style={{ textAlign: "center" }}>
        AI Threat Detection
      </h2>

      <div
        style={{
          width: "80%",
          margin: "20px auto",
        }}
      >
        {anomalies.length === 0 ? (
          <div style={boxStyle}>
            🟢 No suspicious activity detected
          </div>
        ) : (
          anomalies.map((item, index) => (
            <div key={index} style={boxStyle}>
              <p>
                <b>IP:</b> {item.source_ip}
              </p>

              <p>
                <b>Packets:</b> {item.packet_count}
              </p>

              <p>
                <b>Risk:</b>
                {item.packet_count > 500
                  ? " 🔴 HIGH"
                  : item.packet_count > 100
                  ? " 🟠 MEDIUM"
                  : " 🟢 LOW"}
              </p>
            </div>
          ))
        )}
      </div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Top Source IPs
      </h2>

      <div
        style={{
          width: "900px",
          height: "400px",
          margin: "auto",
        }}
      >
        <ResponsiveContainer>
          <BarChart data={sourceIps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ip" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#00C49F"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Top Destination IPs
      </h2>

      <div
        style={{
          width: "900px",
          height: "400px",
          margin: "auto",
        }}
      >
        <ResponsiveContainer>
          <BarChart data={destinationIps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ip" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#0088FE"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Recent Packets
      </h2>

      <div
        style={{
          width: "95%",
          margin: "auto",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#1e293b",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeader}>Protocol</th>
              <th style={tableHeader}>Source IP</th>
              <th style={tableHeader}>Destination IP</th>
              <th style={tableHeader}>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {recentPackets.map((packet, index) => (
              <tr key={index}>
                <td style={tableCell}>
                  {packet.protocol}
                </td>

                <td style={tableCell}>
                  {packet.source_ip}
                </td>

                <td style={tableCell}>
                  {packet.destination_ip}
                </td>

                <td style={tableCell}>
                  {packet.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  width: "160px",
  textAlign: "center",
};

const boxStyle = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "10px",
};

const tableHeader = {
  border: "1px solid #334155",
  padding: "10px",
};

const tableCell = {
  border: "1px solid #334155",
  padding: "10px",
  textAlign: "center",
};

