MATCH (n: NgoAdmin {id: $creatorID})
MERGE (n)-[rq:REQUESTED {timestamp: timestamp()}]->(rr: Request 
{rr_id: randomUUID(), 
category: $catArr,
isResolved: $isResolved, 
title: $reqTitle, 
details: $reqDetails, 
amtRequired: $amtArr, 
volunteerCount: $count,
mapCoords: $coordsArr, 
imageURL: $img, 
reqBy: $creatorID})
RETURN rr, rq.timestamp AS timestamp