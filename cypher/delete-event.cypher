MATCH (e:Event {evt_id: $evtID})<-[c:CONDUCTED]-(n:NgoAdmin {id:$creatorID})
DETACH DELETE e,c RETURN e,c