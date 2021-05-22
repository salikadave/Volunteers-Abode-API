MATCH (n: NgoAdmin {id: $creatorID})
MERGE (n)-[c:CONDUCTED {created_at: timestamp()}]->(e: Event {evt_id: randomUUID(),
category: $catArr,
title: $evtTitle,
day: $day,
date: $date,
time: $time,
location: $location,
meetingLink: $meetingLink,
evtCoord: $evtCoord,
coordMob: $mobile,
isUpcoming: $isUpcoming,
isVirtual: $isVirtual,
details: $evtDetails, 
partCount: $count,
mapCoords: $coordsArr,
imageURL: $img
})
return e,n, c.created_at as created_at