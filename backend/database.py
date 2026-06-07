import sqlite3

conn = sqlite3.connect(
    "network.db",
    check_same_thread=False
)

def get_cursor():
    return conn.cursor()

cursor = get_cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS packets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    protocol TEXT,
    source_ip TEXT,
    destination_ip TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()