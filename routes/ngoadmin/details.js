const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// FETCH ALL NGO
router.get("/", checkAuth, (req, res) => {
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
      res.status(200).json({ userType: 1, userData: data.properties });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err, message: "User does not exist" });
    });
});

// FETCH ALL POSTS
router.get("/posts/:id", checkAuth, (req, res) => {
  req.neo4j
    .read(query("all-posts-ngo"), { userID: req.params.id })
    .then((result) => {
      let p = [];
      let n = result.records[0].get("n").properties;
      let pts = [];
      result.records.forEach((row) => {
        p.push(row.get("p").properties);
        pts.push(row.get("timestamp").toNumber());
      });
      let fetched = {
        p: p,
        n: n,
        t: pts,
      };
      return fetched;
    })
    .then((data) => {
      console.log(data);
      let postData = {};
      if (!data) res.status(200).json({ count: 0, content: [] });
      else {
        for (i = 0; i < data.p.length; i++) {
          data.p[i].timestamp = data.t[i];
        }
        postData = {
          posts: data.p,
          createdBy: data.n
        }
        res.status(200).json({ count: data.p.length, content: postData });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: err, message: "Server unavailable, try again later." });
    });
});

module.exports = router;
