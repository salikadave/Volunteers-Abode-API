MATCH (n: NgoAdmin {id: $resID}),(rq: Request {rr_id: $reqID})
MERGE (n)-[rs:RESOLVED {timestamp: timestamp()}]->(rq)
SET rq.isResolved = true
SET n.mobileNumber = $mobNumber
RETURN rs.timestamp AS timestamp