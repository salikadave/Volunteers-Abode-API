MATCH (n: NgoAdmin {id: $creatorID})
MERGE (n)-[c:CREATED {timestamp: timestamp()}]->(p: Post {p_id: randomUUID(),title: $postTitle, body: $postBody, imageURL: $url})
return p