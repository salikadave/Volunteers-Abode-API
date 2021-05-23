MATCH (e: Event)<-[c:CONDUCTED]-(n: NgoAdmin)
RETURN n,e,c.created_at as created_at
ORDER BY c.created_at DESC