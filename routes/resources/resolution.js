const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// Create Request
// merge ngo and req node & set
router.put("/", checkAuth, (req, res) => {
  let userType = req.body.userType
  const params = {
    resID: req.body.resBy,
    mobNumber: req.body.mobile,
    reqID: req.body.reqID,
  };
  if (!params.resID || !params.reqID || !params.mobNumber) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    switch (userType) {
      case 0:
        resolutionHandler(req, res, params, "resolve-request-volunteer");
        break;
      case 1:
        resolutionHandler(req, res, params, "resolve-request-ngo");
        break;
      default:
        console.log("Default statement switch");
        res.status(422).json({
          message: "User type not mentioned!",
        });
    }
  }
});

const resolutionHandler = (req, res, params, queryType) => {
  req.neo4j
    .write(query(queryType), params)
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

module.exports = router;
