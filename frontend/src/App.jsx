import { useEffect, useState } from "react";

export default function App() {
  const [recentPackets, setRecentPackets] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/recent-packets")
      .then((res) => res.json())
      .then((data) => setRecentPackets(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        color: "white",
        background: "#0f172a",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1>Recent Packets Test</h1>

      {recentPackets.map((packet, index) => (
        <div key={index}>
          <p>
            {packet.protocol} | {packet.source_ip} →{" "}
            {packet.destination_ip}
          </p>
        </div>
      ))}
    </div>
  );
}