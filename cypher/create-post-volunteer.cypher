MATCH (v: Volunteer {id: $creatorID})
MERGE (v)-[c:CREATED {timestamp: timestamp()}]->(p: Post {p_id: randomUUID(),title: $postTitle, body: $postBody, imageURL: $url})
return p