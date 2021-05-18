MATCH (rq:Request {rr_id: $reqID})<-[r:REQUESTED]-(v:Volunteer {id:$creatorID})
DETACH DELETE rq,r RETURN rq,r