const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// UPDATE BY ID
router.delete("/:id", checkAuth, (req, res) => {
  let cypherParams = {
    id: req.params.id,
    userEmail: req.body.email,
  };
  //   res.send({ properties });
  req.neo4j
    .write(query("delete-volunteer"), cypherParams)
    .then((results) => results.records[0])
    .then((data) => {
      res.status(200).json({
        message: "User deleted successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error occured in deleting user",
        err: err,
      });
    });
});

module.exports = router;
