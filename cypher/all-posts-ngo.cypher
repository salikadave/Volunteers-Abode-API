MATCH (p:Post)<-[:CREATED]-(n:NgoAdmin {id: $userID})
return p