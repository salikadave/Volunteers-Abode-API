const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../cypher");

const JWT_SECRET = process.env.JWT_SECRET;

// USER SIGN UP
router.post("/signup", (req, res, next) => {
  const { userType, userName, email, password } = req.body;
  req.neo4j
    .read("MATCH (n {emailID: $email}) RETURN COUNT(n) AS count", {
      email: email,
    })
    .then((result) => result.records[0].get("count").toNumber())
    .then((count) => {
      if (count > 0) {
        return res.status(422).json({ error: "User already exists." });
      } else {
        // ====
        if (!email || !userName || !password) {
          res.status(422).json({ error: "please enter valid credentials" });
        } else {
          console.log(userType);
          // ====
          bcrypt
            .hash(password, 12)
            .then((hashPass) => {
              let userDetails = {
                userName: userName,
                emailID: email,
                password: hashPass,
              };
              switch (userType) {
                case 0:
                  console.log("Volunteer");
                  createVolunteer(userDetails, req, res);
                  break;
                case 1:
                  console.log("ngo");
                  createNgo(userDetails, req, res);
                  break;
                case 2:
                  console.log("system admin");
                  break;
                default:
                  console.log("unauthorized access!");
              }
            })
            .catch((err) => console.log(err));
          // =====
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const createVolunteer = (user, req, res) => {
  // console.log(user);
  req.neo4j
    .write(query("create-volunteer"), user)
    .then((result) => result.records[0].get("v"))
    .then((data) => {
      const access_token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.status(200).json({
        token: access_token,
        message: "User added successfully!",
        id: data.properties.id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
const createNgo = (user, req, res) => {
  req.neo4j
    .write(query("create-ngo-admin"), user)
    .then((result) => result.records[0].get("n"))
    .then((data) => {
      const access_token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.status(200).json({
        token: access_token,
        message: "User added successfully!",
        id: data.properties.id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
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
