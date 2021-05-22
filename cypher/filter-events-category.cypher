MATCH (e:Event)<-[c:CONDUCTED]-(n:NgoAdmin)
WHERE $evtFilter IN e.category
RETURN e, n, c.created_at as created_at
ORDER BY c.created_at DESC