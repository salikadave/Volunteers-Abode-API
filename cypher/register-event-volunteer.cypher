MATCH (v: Volunteer {id: $regBy}),(e: Event {evt_id: $eventID})
MERGE (v)-[rg:REGISTERED {timestamp: timestamp()}]->(e)
RETURN v,e, rg.timestamp AS registered_at