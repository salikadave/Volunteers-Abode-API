MATCH (a)-[rg:REGISTERED]->(e: Event {evt_id: $id})
RETURN a, e, rg.timestamp as registered_at
ORDER BY rg.timestamp DESC