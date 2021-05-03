const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// USER SIGN UP
router.post("/signup", (req, res, next) => {
  const { userType, userName, email, password } = req.body;
  if (!email || !userName || !password) {
    res.status(422).json({ error: "please enter valid credentials" });
  } else {
    console.log(userType);
    switch (userType) {
      case 0:
        console.log("Volunteer");
        createVolunteer(req, res);
        break;
      case 1:
        console.log("ngo");
        createNgo(req, res);
        break;
      case 2:
        console.log("system admin");
        break;
      default:
        console.log("unauthorized access!");
    }
  }
});

const createVolunteer = (req, res) => {
  req.neo4j
    .read("MATCH (n) RETURN count(n) AS count")
    .then((result) => result.records[0].get("count").toNumber())
    .then((count) =>
      res.status(200).json({
        status: "OK",
        count: count,
      })
    )
    .catch((err) => console.log(err));
};
const createNgo = (req, res) => {
  req.neo4j
    .read("MATCH (n) RETURN count(n) AS count")
    .then((result) => result.records[0].get("count").toNumber())
    .then((count) =>
      res.status(200).json({
        status: "OK",
        count: count,
      })
    )
    .catch((err) => console.log(err));
};

router.post("/login", (req, res, next) => {
  console.log("inside user login");
  res.json({
    message: "inside user login",
  });
});

// router.post(
//   "/",
//   [
//     check("user.username").notEmpty(),
//     check("user.email").notEmpty().isEmail(),
//     check("user.password").notEmpty(),
//   ],
//   validate,
//   (req, res, next) => {
//     const { user } = req.body;

//     user.password = bcrypt.hashSync(user.password, rounds);
//     user.bio = user.bio || null;
//     user.image = user.image || null;

//     // Create User
//     req.neo4j
//       .write(cypher("create-user"), user)
//       // Convert to user entity
//       .then((res) => {
//         const user = new User(res.records[0].get("u"));

//         return {
//           ...user.toJson(),
//           // Generate a JWT token
//           token: generateToken(user.getClaims()),
//         };
//       })
//       // Return the output
//       .then((user) => res.json({ user }))
//       // Pass any errors to the next middleware
//       .catch(next);
//   }
// );

// USER LOGIN

// router.post("/login", passport.authenticate("local"), (req, res, next) => {
//   res.status(201).json({
//     user: {
//       // Use user bound to request
//       ...req.user.toJson(),
//       // Generate a JWT token
//       token: generateToken(req.user.getClaims()),
//     },
//   });
// });

module.exports = router;
