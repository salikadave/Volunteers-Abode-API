MATCH (p:Post {p_id: $id})
SET p += $properties
RETURN p