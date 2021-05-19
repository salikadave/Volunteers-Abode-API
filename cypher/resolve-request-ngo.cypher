MATCH (n: NgoAdmin {id: $resID}),(rq: Request {rr_id: $reqID})
MERGE (n)-[rs:RESOLVED {timestamp: timestamp()}]->(rq)
SET rq.isResolved = true
RETURN rs.timestamp AS timestamp