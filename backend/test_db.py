from database import cursor

cursor.execute("SELECT COUNT(*) FROM packets")

count = cursor.fetchone()[0]

print("Total Packets:", count)