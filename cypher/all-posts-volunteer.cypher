MATCH (p:Post)<-[:CREATED]-(v:Volunteer {id: $userID})
return p