MATCH (a: NgoAdmin {id: $userID})-[rq:REQUESTED]->(rr: Request)
RETURN a, rr, rq.timestamp as timestamp
ORDER BY rq.timestamp DESC

