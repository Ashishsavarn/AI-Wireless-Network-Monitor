from collections import Counter

protocol_counter = Counter()

def update_stats(protocol):
    protocol_counter[protocol] += 1

def get_stats():
    return {
        "TCP": protocol_counter["TCP"],
        "UDP": protocol_counter["UDP"],
        "ICMP": protocol_counter["ICMP"],
        "TOTAL": sum(protocol_counter.values())
    }