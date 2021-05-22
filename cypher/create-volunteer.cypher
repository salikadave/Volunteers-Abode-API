CREATE (v:Volunteer {
    id: randomUUID(),
    userType: $userType,
    userName: $userName,
    password: $password,
    emailID: $emailID,
    joinedOn: timestamp()
})
RETURN v