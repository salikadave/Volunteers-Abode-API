MATCH (v:Volunteer {id: $id, emailID: $userEmail})
DETACH DELETE v RETURN v