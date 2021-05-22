const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// Create Request
router.post("/new", checkAuth, (req, res) => {
  // let userType = req.body.userType;
  const params = {
    creatorID: req.body.conductByID,
    catArr: req.body.categories,
    evtTitle: req.body.evtName,
    day: req.body.day,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location || "",
    meetingLink: req.body.meetingLink || "",
    evtCoord: req.body.evtCoord || "",
    mobile: req.body.evtCoordMob || 0,
    isUpcoming: req.body.isUpcoming || 1,
    isVirtual: req.body.isVirtual || 0,
    evtDetails: req.body.details || "",
    count: req.body.participantCount || 0,
    coordsArr: req.body.mapCoords || [],
    img: req.body.imageURL || "",
  };
  if (
    !params.creatorID ||
    !params.evtTitle ||
    !params.date ||
    !params.time ||
    !params.catArr
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    // console.log(params);
    evtCreationHandler(req, res, params, "create-event-ngo");
  }
});

const evtCreationHandler = (req, res, params, queryType) => {
  req.neo4j
    .write(query(queryType), params)
    .then((result) => {
      let fetched = {
        evtDetails: result.records[0].get("e").properties,
        ngoDetails: result.records[0].get("n").properties,
        createdAt: result.records[0].get("created_at").toNumber(),
      };
      return fetched;
    })
    .then((data) => {
      res.status(200).send({
        message: "Event added successfully!",
        details: { ...data },
      });
    })
    .catch((err) => console.log(err));
};

module.exports = router;
