const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// FETCH ALL REQUESTS
router.get("/all", checkAuth, (req, res) => {
  req.neo4j
    .read(
      "MATCH (rr:Request)<-[rs:REQUESTED]-(a) RETURN rr, a,rs.timestamp as timestamp ORDER BY rs.timestamp DESC"
    )
    .then((result) => {
      let r = {};
      let a = {};
      let ts = 0;
      let fetched = [];
      result.records.map((row) => {
        r = row.get("rr").properties;
        // r.category = r.category.toString();
        a = row.get("a").properties;
        ts = row.get("timestamp").toNumber();
        let result = { details: r, reqBy: a, timestamp: ts };
        fetched.push(result);
      });
      // console.log(fetched)
      return fetched;
    })
    .then((data) => {
      if (!data.length)
        res.status(404).send({ count: 0, message: "No records found!" });
      else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
        message: "Server currently not available, please try again later.",
      });
    });
});

// FETCH SINGLE RESOLVED REQUEST DETAILS
router.get("/resolved/:id", checkAuth, (req, res) => {
  req.neo4j
    .read(
      "MATCH (b)-[rq:REQUESTED]->(rr:Request {rr_id: $userID})<-[rs:RESOLVED]-(a) RETURN rr,a,b",
      {
        userID: req.params.id,
      }
    )
    .then((result) => {
      let r = {};
      let a = [];
      let b = {};
      let fetched = {};
      // console.log(result.records);
      result.records.map((row) => {
        r = row.get("rr").properties;
        b = row.get("b").properties;
        a.push(row.get("a").properties);
        // b.push(row.get("b").properties);
      });
      fetched["reqDetails"] = r;
      fetched["requestedDetails"] = b;
      fetched["resolvedDetails"] = a;
      return fetched;
    })
    .then((data) => {
      if (!data)
        res.status(404).send({ count: 0, message: "No records found!" });
      else {
        res.status(200).json({ data });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err, message: "Request does not exist" });
    });
});

// Requests posted by a user
router.get("/user", (req, res) => {
  let params = {
    userID: req.body.id,
  };
  if (!params.userID)
    return res.status(422).json({ error: "Please add all the fields" });
  else {
    switch (req.body.userType) {
      case 0:
        requestsByUserHandler(req, res, params, "requests-volunteer");
        break;
      case 1:
        requestsByUserHandler(req, res, params, "requests-ngo");
        break;

      default:
        console.log("Default statement switch");
        res.status(422).json({
          message: "User type not mentioned!",
        });
    }
  }
});

const requestsByUserHandler = (req, res, params, queryType) => {
  req.neo4j
    .read(query(queryType), params)
    .then((result) => {
      let r = {};
      let a = {};
      let ts = 0;
      let fetched = [];
      result.records.map((row) => {
        r = row.get("rr").properties;
        a = row.get("a").properties;
        ts = row.get("timestamp").toNumber();
        let result = { details: r, timestamp: ts };
        fetched.push(result);
      });
      fetched.push(a);
      return fetched;
    })
    .then((data) => {
      if (!data)
        res.status(404).send({ count: 0, message: "No records found!" });
      else {
        let userData = data.pop();
        res.status(200).json({ data, userData });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err, message: "Request does not exist" });
    });
};

module.exports = router;
