const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

const JWT_SECRET = process.env.JWT_SECRET;

// FETCH USER DETAILS
router.get("/:id", (req, res) => {
  req.neo4j
    .read(query("get-user-detail"), { userID: req.params.id })
    .then((result) => result.records)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
