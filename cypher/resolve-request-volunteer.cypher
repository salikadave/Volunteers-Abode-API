MATCH (v: Volunteer {id: $resID}),(rq: Request {rr_id: $reqID})
MERGE (v)-[rs:RESOLVED {timestamp: timestamp()}]->(rq)
SET v.mobileNumber = $mobNumber
RETURN rs.timestamp AS timestamp