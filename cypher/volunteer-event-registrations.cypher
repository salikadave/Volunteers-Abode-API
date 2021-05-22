MATCH (v: Volunteer {id: $id})-[rg:REGISTERED]->(e: Event)
RETURN v, e, rg.timestamp as registered_at
ORDER BY rg.timestamp DESC