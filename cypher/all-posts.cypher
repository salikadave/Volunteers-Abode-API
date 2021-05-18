MATCH (p:Post)<-[c:CREATED]-(u)
RETURN p,u,c.timestamp as timestamp
ORDER BY c.timestamp DESC