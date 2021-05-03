CREATE (n:NgoAdmin {
    id: randomUUID(),
    userName: $userName,
    password: $password,
    emailID: $emailID
})
RETURN n