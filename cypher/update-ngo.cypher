MATCH (n:NgoAdmin {id: $id})
SET n += $properties
RETURN n