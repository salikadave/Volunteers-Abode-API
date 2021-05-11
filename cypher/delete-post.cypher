MATCH (p:Post {p_id: $pID})<-[c:CREATED]-(v:Volunteer {id:$creatorID})
DETACH DELETE p,c RETURN p,c