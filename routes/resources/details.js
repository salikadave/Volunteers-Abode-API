const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// FETCH ALL REQUESTS
router.get("/all", checkAuth, (req, res) => {
  req.neo4j
    .read("MATCH (rr:Request)<-[rs:REQUESTED]-(a) RETURN rr, a")
    .then((result) => {
      let r = {};
      let a = {};
      let fetched = [];
      result.records.map((row) => {
        r = row.get("rr").properties;
        // r.category = r.category.toString();
        a = row.get("a").properties;
        let result = { details: r, reqBy: a };
        fetched.push(result);
      });
      // console.log(fetched)
      return fetched;
    })
    .then((data) => {
      if (!data.length)
        res.status(404).send({ count: 0, message: "No records found!" });
      else {
        // let requestList = [];
        // data.forEach((row) => {
        //   requestList.push(row.properties);
        // });
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

// FETCH SINGLE REQUEST DETAILS
router.get("/:id", checkAuth, (req, res) => {
  req.neo4j
    .read("MATCH (rr:Request {rr_id: $userID}) RETURN rr", {
      userID: req.params.id,
    })
    .then((result) => result.records[0].get("rr"))
    .then((data) => {
      if (!data)
        res.status(404).send({ count: 0, message: "No records found!" });
      else {
        res.status(200).json({ requestData: data[0].properties });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err, message: "Request does not exist" });
    });
});

module.exports = router;
