MATCH (n:NgoAdmin {id: $id, emailID: $userEmail})
DETACH DELETE n RETURN n