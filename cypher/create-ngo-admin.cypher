CREATE (n:NgoAdmin {
    id: randomUUID(),
    userType: $userType,
    userName: $userName,
    password: $password,
    emailID: $emailID,
    joinedOn: timestamp()
})
RETURN n