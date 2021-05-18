CREATE (v:Volunteer {
    id: randomUUID(),
    userType: $userType,
    userName: $userName,
    password: $password,
    emailID: $emailID
})
RETURN v