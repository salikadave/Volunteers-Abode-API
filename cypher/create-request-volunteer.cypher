MATCH (v: Volunteer {id: $creatorID})
MERGE (v)-[rq:REQUESTED {timestamp: timestamp()}]->(rr: Request 
{rr_id: randomUUID(), 
category: $catArr, 
title: $reqTitle, 
details: $reqDetails, 
amtRequired: $amtArr, 
volunteerCount: $count,
mapCoords: $coordsArr, 
imageURL: $img, 
reqBy: $creatorID})
RETURN rr, rq.timestamp AS timestamp