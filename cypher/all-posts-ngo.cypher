MATCH (p:Post)<-[:CREATED]-(n:NgoAdmin {id: $userID})
return p,n,c.timestamp as timestamp
ORDER BY c.timestamp DESC