MATCH (v:Volunteer {id: $id})
SET v += $properties
RETURN v