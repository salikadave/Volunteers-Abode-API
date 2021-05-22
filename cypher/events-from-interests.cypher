MATCH (v:Volunteer {id: $userID})
UNWIND v.interests as I
MATCH (e:Event)<-[c:CONDUCTED]-(n)
WHERE I in e.category
RETURN e,n, c.created_at as created_at
ORDER BY c.created_at, e.isUpcoming DESC