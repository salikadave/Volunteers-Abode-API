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
                userType: userType,
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
        userType: data.properties.userType,
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
      const access_token = jwt.sign({ _id: data.properties.id }, JWT_SECRET);
      res.status(200).json({
        token: access_token,
        message: "User added successfully!",
        userType: data.properties.userType,
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

// USER LOGIN

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  req.neo4j
    .read("MATCH (n {emailID: $email}) RETURN n {.id, .password, .userType}", {
      email: email,
    })
    .then((result) => {
      return result.records[0];
    })
    .then((data) => {
      if (!data) {
        return res.status(422).json({ error: "Invalid Email or password" });
      } else {
        console.log(data);
        bcrypt
          .compare(password, data._fields[0].password)
          .then((doMatch) => {
            if (doMatch) {
              // res.json({message:"successfully signed in"})
              const access_token = jwt.sign(
                { _id: data._fields[0].id },
                JWT_SECRET
              );
              res.json({
                token: access_token,
                message: "Logged in successfully!",
                id: data._fields[0].id,
                userType: data._fields[0].userType
              });
            } else {
              return res
                .status(422)
                .json({ error: "Invalid Email or password" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      let userDetails = {
        id: data._fields[0],
        pass: data._fields[1],
      };
    })
    .catch((err) => console.log(err));
  // res.status(201).json({
  //   user: {
  //     // Use user bound to request
  //     ...req.user.toJson(),
  //     // Generate a JWT token
  //     token: generateToken(req.user.getClaims()),
  //   },
  // });
});

module.exports = router;
