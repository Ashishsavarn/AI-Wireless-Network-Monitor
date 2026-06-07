from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP, ICMP

from database import conn, cursor

def process_packet(packet):

    if IP in packet:

        src_ip = packet[IP].src
        dst_ip = packet[IP].dst

        protocol = "OTHER"

        if TCP in packet:
            protocol = "TCP"

        elif UDP in packet:
            protocol = "UDP"

        elif ICMP in packet:
            protocol = "ICMP"

        cursor.execute(
            """
            INSERT INTO packets(
                protocol,
                source_ip,
                destination_ip
            )
            VALUES(?,?,?)
            """,
            (
                protocol,
                src_ip,
                dst_ip
            )
        )

        conn.commit()

        print(
            f"{protocol} | {src_ip} -> {dst_ip}"
        )

print("Monitoring Network Traffic...")

sniff(prn=process_packet, store=False)