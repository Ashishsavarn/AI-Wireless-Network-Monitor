import sqlite3
import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies():
    conn = sqlite3.connect("network.db")

    query = """
    SELECT source_ip, COUNT(*) as packet_count
    FROM packets
    GROUP BY source_ip
    """

    df = pd.read_sql_query(query, conn)

    if len(df) < 5:
        return []

    model = IsolationForest(
        contamination=0.1,
        random_state=42
    )

    df["anomaly"] = model.fit_predict(
        df[["packet_count"]]
    )

    suspicious = df[df["anomaly"] == -1]

    return suspicious.to_dict(orient="records")