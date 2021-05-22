const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// Registered Participants
router.get("/participants", checkAuth, (req, res) => {
  let params = {
    id: req.body.eventID,
  };
  if (!params.id)
    return res.status(422).json({ error: "Please add all the fields" });
  else {
    req.neo4j
      .read(query("event-registrations"), params)
      .then((result) => {
        let e = {};
        let a = {};
        let ts = 0;
        let fetched = [];
        result.records.map((row) => {
          e = row.get("e").properties;
          a = row.get("a").properties;
          ts = row.get("registered_at").toNumber();
          let result = { users: a, timestamp: ts };
          fetched.push(result);
        });
        fetched.push(e);
        return fetched;
      })
      .then((data) => {
        if (!data)
          res.status(404).send({ count: 0, message: "No records found!" });
        else {
          let evtData = data.pop();
          res.status(200).json({ data, evtData });
        }
      })
      .catch((err) => {
        res.status(500).json({
          err: err,
          message: "Server currently not available, please try again later.",
        });
      });
  }
});

// GET events by NGO
router.get("/ngo", checkAuth, (req, res) => {
  let params = {
    ngoID: req.body.ngoID,
  };
  if (!params.ngoID)
    return res.status(422).json({ error: "Please add all the fields" });
  else {
    req.neo4j
      .read(query("all-events-conducted"), params)
      .then((result) => {
        let e = {};
        let n = {};
        let ts = 0;
        let fetched = [];
        result.records.map((row) => {
          e = row.get("e").properties;
          n = row.get("n").properties;
          ts = row.get("created_at").toNumber();
          let result = { events: e, timestamp: ts };
          fetched.push(result);
        });
        fetched.push(n);
        return fetched;
      })
      .then((data) => {
        if (!data)
          res.status(404).send({ count: 0, message: "No records found!" });
        else {
          let ngoData = data.pop();
          let pastEvt = [];
          let upcomingEvt = [];
          data.forEach((record) => {
            if (record.events.isUpcoming) {
              upcomingEvt.push(record.events);
            } else {
              pastEvt.push(record.events);
            }
          });
          res.status(200).json({ pastEvt, upcomingEvt, ngoData });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          err: err,
          message: "Server currently not available, please try again later.",
        });
      });
  }
});

// Get a volunteer's registered events
router.get("/registered", checkAuth, (req, res) => {
  let params = {
    id: req.body.volID,
  };
  if (!params.id)
    return res.status(422).json({ error: "Please add all the fields" });
  else {
    req.neo4j
      .read(query("volunteer-event-registrations"), params)
      .then((result) => {
        let e = {};
        let v = {};
        let ts = 0;
        let fetched = [];
        result.records.map((row) => {
          e = row.get("e").properties;
          v = row.get("v").properties;
          ts = row.get("registered_at").toNumber();
          let result = { event: e, registered_at: ts };
          fetched.push(result);
        });
        fetched.push(v);
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
        res.status(500).json({
          err: err,
          message: "Server currently not available, please try again later.",
        });
      });
  }
});



// GET events by category

// GET recommended events for a user

// GET popular events ie. number of participants

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
      res.status(200).json({ userData: data.properties });
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
    .then((result) => result.records.map((row) => row.get("p")))
    .then((data) => {
      let postData = [];
      if (data.length) res.status(200).json({ count: 0, content: [] });
      else {
        data.forEach((record) => {
          postData.push(record.properties);
        });
        res.status(200).json({ count: data.length, content: postData });
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
