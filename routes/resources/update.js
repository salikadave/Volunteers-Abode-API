const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// UPDATE BY ID
router.put("/:id", checkAuth, (req, res) => {
  const { ...properties } = req.body;
  let cypherParams = {
    id: req.params.id,
    properties: properties,
  };
  req.neo4j
    .write(
      "MATCH (r:Request {rr_id: $id}) SET r += $properties RETURN r",
      cypherParams
    )
    .then((results) => results.records[0])
    .then((data) => {
      // console.log(data);
      res.status(200).json({
        message: "Data updated successfully!",
        dataUpdated: data._fields[0].properties,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error occured in updating resource details",
        err: err,
      });
    });
});

module.exports = router;
