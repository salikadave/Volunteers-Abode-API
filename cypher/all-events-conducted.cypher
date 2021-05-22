MATCH (n: NgoAdmin {id: $ngoID})-[c:CONDUCTED]->(e: Event)
RETURN n,e,c.created_at as created_at
ORDER BY c.created_at DESC