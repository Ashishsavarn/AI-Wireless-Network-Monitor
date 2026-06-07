from fastapi import FastAPI
from backend.database import cursor
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "AI Wireless Network Monitor Running"
    }

@app.get("/stats")
def stats():

    cursor.execute("""
        SELECT protocol, COUNT(*)
        FROM packets
        GROUP BY protocol
    """)

    rows = cursor.fetchall()

    result = {
        "TCP": 0,
        "UDP": 0,
        "ICMP": 0,
        "OTHER": 0
    }

    for protocol, count in rows:
        result[protocol] = count

    result["TOTAL"] = sum(result.values())

    return result
@app.get("/top-source-ips")
def top_source_ips():

    cursor.execute("""
        SELECT source_ip,
               COUNT(*) as total
        FROM packets
        GROUP BY source_ip
        ORDER BY total DESC
        LIMIT 10
    """)

    rows = cursor.fetchall()

    result = []

    for ip, total in rows:
        result.append({
            "ip": ip,
            "count": total
        })

    return result
@app.get("/top-destination-ips")
def top_destination_ips():

    cursor.execute("""
        SELECT destination_ip,
               COUNT(*) as total
        FROM packets
        GROUP BY destination_ip
        ORDER BY total DESC
        LIMIT 10
    """)

    rows = cursor.fetchall()

    result = []

    for ip, total in rows:
        result.append({
            "ip": ip,
            "count": total
        })

    return result
@app.get("/recent-packets")
def recent_packets():

    cursor.execute("""
        SELECT protocol,
               source_ip,
               destination_ip,
               timestamp
        FROM packets
        ORDER BY id DESC
        LIMIT 20
    """)

    rows = cursor.fetchall()

    result = []

    for protocol, source, destination, timestamp in rows:

        result.append({
            "protocol": protocol,
            "source_ip": source,
            "destination_ip": destination,
            "timestamp": timestamp
        })

    return result