const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// FETCH ALL NGO
router.get("/", checkAuth,(req, res) => {
  req.neo4j
    .read("MATCH (n:NgoAdmin) RETURN n {.id, .ngoName, .emailID} as details")
    .then((result) => result.records.map((row) => row.get("details")))
    .then((data) => {
      res.status(200).json(data);
    });
});

// FETCH SINGLE NGO
router.get("/:id", checkAuth, (req, res) => {
  req.neo4j
    .read(query("get-ngo-detail"), { userID: req.params.id })
    .then((result) => result.records[0].get("n"))
    .then((data) => {
      res.status(200).json({ userData: data.properties });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err, message: "User does not exist" });
    });
});

module.exports = router;
