const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// UPDATE BY ID
router.delete("/:reqID", checkAuth, (req, res) => {
  let cypherParams = {
    reqID: req.params.reqID,
    creatorID: req.body.userID,
  };
  req.neo4j
    .write(query("delete-request"), cypherParams)
    .then((results) => results.records[0])
    .then((data) => {
      res.status(200).json({
        message: "Request deleted successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error occured in deleting request.",
        err: err,
      });
    });
});

module.exports = router;
