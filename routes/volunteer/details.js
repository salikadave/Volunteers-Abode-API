const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// FETCH ALL VOLUNTEERS
router.get("/", checkAuth, (req, res) => {
  req.neo4j
    .read("MATCH (v:Volunteer) RETURN v {.id, .userName, .emailID} as details")
    .then((result) => result.records.map((row) => row.get("details")))
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
        message: "Server currently not available, please try again later.",
      });
    });
});

// FETCH SINGLE VOLUNTEER
router.get("/:id", checkAuth, (req, res) => {
  req.neo4j
    .read(query("get-volunteer-detail"), { userID: req.params.id })
    .then((result) => result.records[0].get("v"))
    .then((data) => {
      res.status(200).json({ userType: 0, userData: data.properties });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err, message: "User does not exist" });
    });
});

// FETCH ALL POSTS
router.get("/posts/:id", checkAuth, (req, res) => {
  req.neo4j
    .read(query("all-posts-volunteer"), { userID: req.params.id })
    .then((result) => {
      let p = [];
      let v = result.records[0].get("v").properties;
      let pts = [];
      result.records.forEach((row) => {
        p.push(row.get("p").properties);
        pts.push(row.get("timestamp").toNumber());
      });
      let fetched = {
        p: p,
        v: v,
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
          createdBy: data.v
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
