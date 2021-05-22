MATCH (v: Volunteer {id: $regBy}),(e: Event {evt_id: $eventID})
MERGE (v)-[rg:REGISTERED {timestamp: timestamp()}]->(e)
SET e.partCount = e.partCount + 1
RETURN v,e, rg.timestamp AS registered_at