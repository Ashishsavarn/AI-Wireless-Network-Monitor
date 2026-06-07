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
  LineChart,
  Line,
} from "recharts";

export default function App() {
  const [stats, setStats] = useState(null);
  const [sourceIps, setSourceIps] = useState([]);
  const [destinationIps, setDestinationIps] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [recentPackets, setRecentPackets] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:8000/stats")
        .then((res) => res.json())
        .then((data) => {
  setStats(data);

  setTrafficData((prev) => [
    ...prev.slice(-49),
    {
      time: new Date().toLocaleTimeString(),
      packets: data.TOTAL,
    },
  ]);
})
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
        setLastUpdated(
  new Date().toLocaleTimeString()
);
    };

    fetchData();
    setTrafficData((prev) => [
  ...prev.slice(-9),
  {
    time: new Date().toLocaleTimeString(),
    packets: stats?.TOTAL || 0,
  },
]);
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div
        style={{
          background: "#000000",
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

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];
  const downloadReport = () => {
  const report = JSON.stringify(
    anomalies,
    null,
    2
  );

  const blob = new Blob(
    [report],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "threat_report.json";

  a.click();
};
  return (
    <>
    <style>{blinkStyle}</style>
    <div
      style={{
        background: "#000000",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "48px",
          marginBottom: "10px",
        }}
      >
        🛡️ CYBER SECURITY OPERATIONS CENTER
      </h1>
      <div
  style={{
    textAlign: "center",
    color: "#ffffff",
    marginTop: "10px",
    fontSize: "18px",
  }}
>
  {new Date().toLocaleString()}
</div>

      <p
        style={{
          textAlign: "center",
          color: "#22c55e",
          fontWeight: "bold",
          fontSize: "18px",
          letterSpacing: "3px",
          textShadow: "0 0 10px #22c55e",
        }}
      >
        ● REAL-TIME THREAT INTELLIGENCE SYSTEM
      </p>
      <div
  style={{
    textAlign: "center",
    marginTop: "15px",
    fontWeight: "bold",
    color:
      anomalies.length > 0
        ? "#ef4444"
        : "#22c55e",
    animation:
      anomalies.length > 0
        ? "blink 1s infinite"
        : "none",
  }}
>
  {anomalies.length > 0
    ? `🚨 ${anomalies.length} THREAT(S) DETECTED`
    : "🟢 SYSTEM ONLINE"}

  {" | "} Last Updated: {lastUpdated}
</div>

      <div
        style={{
          width: "90%",
          margin: "20px auto",
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center",
          fontWeight: "bold",
          background:
            anomalies.length > 0
              ? "rgba(239,68,68,0.2)"
              : "rgba(34,197,94,0.2)",
          border:
            anomalies.length > 0
              ? "2px solid #ef4444"
              : "2px solid #22c55e",
          boxShadow:
            anomalies.length > 0
              ? "0 0 20px rgba(239,68,68,0.6)"
              : "0 0 20px rgba(34,197,94,0.6)",
        }}
      >
        {anomalies.length > 0
          ? `🚨 THREAT ALERT: ${anomalies.length} suspicious IP(s) detected`
          : "🟢 SYSTEM SECURE - Monitoring Active"}
      </div>

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
        <div style={cardStyle}>
  <h3>Health</h3>
  <h1>
    {anomalies.length === 0
      ? "100%"
      : anomalies.length === 1
      ? "90%"
      : "75%"}
  </h1>
</div>
<div style={cardStyle}>
  <h3>Traffic</h3>
  <h1>
    {Math.floor(stats.TOTAL / 60)}
  </h1>
</div>

        <div style={cardStyle}>
          <h3>Status</h3>
          <h2
            style={{
              color:
                anomalies.length > 0
                  ? "#ef4444"
                  : "#22c55e",
            }}
          >
            {anomalies.length > 0
              ? "ALERT"
              : "ACTIVE"}
          </h2>
        </div>
      </div>

<h2
  style={{
    textAlign: "center",
    marginTop: "40px",
    color: "#22c55e",
    textShadow: "0 0 10px #22c55e",
  }}
>
  Protocol Distribution
</h2>

      <div
        style={{
          width: "500px",
          height: "400px",
          margin: "20px auto",
          background: "#050505",
          border: "1px solid #22c55e",
          borderRadius: "12px",
          padding: "20px",
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

     <h2
  style={{
    textAlign: "center",
    color: "#22c55e",
    textShadow: "0 0 10px #22c55e",
  }}
>
  <div
  style={{
    width: "80%",
    margin: "20px auto",
    background: "#050505",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid red",
  }}
>
  <h2>Top Attacker</h2>

  {anomalies.length > 0 ? (
    <>
      <p>
        IP: {anomalies[0].source_ip}
      </p>

      <p>
        Packets:
        {anomalies[0].packet_count}
      </p>
    </>
  ) : (
    <p>No attacker detected</p>
  )}
</div>
  AI Threat Detection
</h2>
<div
  style={{
    textAlign: "center",
    marginBottom: "20px",
  }}
>
  <button
    onClick={downloadReport}
    style={{
      background: "#22c55e",
      border: "none",
      padding: "12px 20px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Download Threat Report
  </button>
</div>
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

              <div
  style={{
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    marginTop: "10px",
    background:
      item.packet_count > 500
        ? "#7f1d1d"
        : item.packet_count > 100
        ? "#78350f"
        : "#14532d",
    color: "white",
    fontWeight: "bold",
  }}
>
  {item.packet_count > 500
    ? "🔴 HIGH RISK"
    : item.packet_count > 100
    ? "🟠 MEDIUM RISK"
    : "🟢 LOW RISK"}
</div>
            </div>
          ))
        )}
      </div>

<h2
  style={{
    textAlign: "center",
    marginTop: "40px",
    color: "#22c55e",
    textShadow: "0 0 10px #22c55e",
  }}
>
  Top Source IPs
</h2>

      <div style={chartContainer}>
        <ResponsiveContainer>
          <BarChart data={sourceIps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ip" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

<h2
  style={{
    textAlign: "center",
    marginTop: "40px",
    color: "#22c55e",
    textShadow: "0 0 10px #22c55e",
  }}
>
  Top Destination IPs
</h2>

      <div style={chartContainer}>
        <ResponsiveContainer>
          <BarChart data={destinationIps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ip" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

<h2
  style={{
    textAlign: "center",
    marginTop: "40px",
    color: "#22c55e",
    textShadow: "0 0 10px #22c55e",
  }}
>
  <h2
  style={{
    textAlign: "center",
    color: "#22c55e",
    marginTop: "40px",
  }}
>
  Live Network Traffic
</h2>

<div style={chartContainer}>
  <ResponsiveContainer>
    <LineChart data={trafficData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />

      <Line
        type="monotone"
        dataKey="packets"
        stroke="#22c55e"
      />
    </LineChart>
  </ResponsiveContainer>
</div>
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
                <td
  style={{
    ...tableCell,
    color:
      packet.protocol === "TCP"
        ? "#22c55e"
        : packet.protocol === "UDP"
        ? "#3b82f6"
        : "#ef4444",
    fontWeight: "bold",
  }}
>
  {packet.protocol}
</td>
                <td style={tableCell}>{packet.source_ip}</td>
                <td style={tableCell}>{packet.destination_ip}</td>
                <td style={tableCell}>{packet.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
  textAlign: "center",
  marginTop: "50px",
  color: "#22c55e",
  textShadow: "0 0 10px #22c55e",
}}
      >
        CYBER SECURITY OPERATIONS CENTER • THREAT MONITORING ACTIVE
      </div>
    </div>
    </>
  );
}

const cardStyle = {
  background: "#0a0a0a",
  padding: "20px",
  borderRadius: "12px",
  width: "160px",
  textAlign: "center",
  boxShadow: "0 0 15px rgba(34,197,94,0.5)",
  border: "1px solid #22c55e",
};

const boxStyle = {
  background: "#050505",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "10px",
  borderLeft: "5px solid #ef4444",
  boxShadow: "0 0 10px rgba(239,68,68,0.4)",
};

const chartContainer = {
  width: "95%",
  height: "400px",
  margin: "auto",
  background: "#050505",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #22c55e",
};

const tableHeader = {
  border: "1px solid #22c55e",
  padding: "10px",
  color: "#22c55e",
};

const tableCell = {
  border: "1px solid #22c55e",
}
const blinkStyle = `
@keyframes blink {
  50% {
    opacity: 0.3;
  }
}
`;