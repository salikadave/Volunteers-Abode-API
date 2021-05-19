const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// Create Request
// merge ngo and req node & set
router.put("/", checkAuth, (req, res) => {
  const params = {
    resID: req.body.resBy,
    reqID: req.body.reqID,
  };
  if (!params.resID || !params.reqID) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    req.neo4j
      .write(query("resolve-request-ngo"), params)
      .then((result) => result.records[0].get("timestamp").toNumber())
      .then((data) => {
        console.log(data);
        res.status(200).send({
          message: "Request resolved successfully!",
          details: { resolved_at: data },
        });
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
