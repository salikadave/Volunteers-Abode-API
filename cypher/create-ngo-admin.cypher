CREATE (n:NgoAdmin {
    id: randomUUID(),
    userType: $userType,
    userName: $userName,
    password: $password,
    emailID: $emailID
})
RETURN n