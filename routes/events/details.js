const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// GET details of all events
router.get("/all", checkAuth, (req, res) => {
  req.neo4j
    .read(query("all-general-events"))
    .then((result) => {
      let e = {};
      let n = {};
      let ts = 0;
      let fetched = [];
      result.records.map((row) => {
        e = row.get("e").properties;
        n = row.get("n").properties;
        ts = row.get("created_at").toNumber();
        let result = { event: e, conductedBy: n, timestamp: ts };
        fetched.push(result);
      });
      return fetched;
    })
    .then((data) => {
      if (!data)
        res.status(404).send({ count: 0, message: "No records found!" });
      else {
        // let ngoData = data.pop();
        // let pastEvt = [];
        // let upcomingEvt = [];
        // data.forEach((record) => {
        //   if (record.events.isUpcoming) {
        //     upcomingEvt.push(record.events);
        //   } else {
        //     pastEvt.push(record.events);
        //   }
        // });
        res.status(200).json({ data });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err: err,
        message: "Server currently not available, please try again later.",
      });
    });
});

// Get details of an event
router.get("/:id", checkAuth, (req, res) => {
  let params = {
    id: req.params.id,
  };
  req.neo4j
    .read("MATCH (e:Event {evt_id: $id})<-[c:CONDUCTED]-(a) RETURN a,e", params)
    .then((result) => {
      let e = result.records[0].get("e").properties;
      let a = result.records[0].get("a").properties;
      let fetched = {
        evtDetails: e,
        conductedBy: a,
      };
      return fetched;
    })
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

// Registered Participants
router.get("/participants/:eventID", checkAuth, (req, res) => {
  let params = {
    id: req.params.eventID,
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
          let result = { user: a, timestamp: ts };
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
router.get("/ngo/:ngoID", checkAuth, (req, res) => {
  let params = {
    ngoID: req.params.ngoID,
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
router.get("/registered/:volID", checkAuth, (req, res) => {
  let params = {
    id: req.params.volID,
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
        console.log(err);
        res.status(500).json({
          err: err,
          message: "Server currently not available, please try again later.",
        });
      });
  }
});

// GET recommended events for a user
router.get("/interests/:id", (req, res) => {
  let params = {
    userID: req.params.id,
  };
  if (!params.userID)
    return res.status(422).json({ error: "Please add all the fields" });
  else {
    req.neo4j
      .read(query("events-from-interests"), params)
      .then((result) => {
        let e = {};
        let n = {};
        let ts = 0;
        let fetched = [];
        result.records.map((row) => {
          e = row.get("e").properties;
          n = row.get("n").properties;
          ts = row.get("created_at").toNumber();
          let result = { event: e, conductedBy: n, created_at: ts };
          fetched.push(result);
        });
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
        res.status(500).json({
          err: err,
          message: "Server currently not available, please try again later.",
        });
      });
  }
});

// GET events by category
router.get("/category/:filterStr", checkAuth, (req, res) => {
  let params = {
    evtFilter: req.params.filterStr,
  };
  if (!params.evtFilter)
    return res.status(422).json({ error: "Please add all the fields" });
  else {
    req.neo4j
      .read(query("filter-events-category"), params)
      .then((result) => {
        let e = {};
        let n = {};
        let ts = 0;
        let fetched = [];
        result.records.map((row) => {
          e = row.get("e").properties;
          n = row.get("n").properties;
          ts = row.get("created_at").toNumber();
          let result = { event: e, conductedBy: n, created_at: ts };
          fetched.push(result);
        });
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
        res.status(500).json({
          err: err,
          message: "Server currently not available, please try again later.",
        });
      });
  }
});

// GET popular events ie. number of participants

module.exports = router;
