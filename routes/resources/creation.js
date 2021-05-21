const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// Create Request
router.post("/", checkAuth, (req, res) => {
  let userType = req.body.userType;
  const params = {
    creatorID: req.body.reqBy,
    catArr: req.body.categories,
    reqTitle: req.body.title,
    reqDetails: req.body.details,
    amtArr: req.body.amtRequired,
    count: req.body.volCount,
    coordsArr: req.body.mapCoords,
    img: req.body.imageURL,
    isResolved: false
  };
  if (
    !params.creatorID ||
    !params.reqTitle ||
    !params.amtArr ||
    !params.catArr 
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    switch (userType) {
      case 0:
        reqCreationHandler(req, res, params, "create-request-volunteer");
        break;
      case 1:
        reqCreationHandler(req, res, params, "create-request-ngo");
        break;
      default:
        console.log("Default statement switch");
        res.status(422).json({
          message: "User type not mentioned!",
        });
    }
  }
});

const reqCreationHandler = (req, res, params, queryType) => {
  req.neo4j
    .write(query(queryType), params)
    .then((result) => {
      let fetched = {
        reqDetails: result.records[0].get("rr"),
        timestamp: result.records[0].get("timestamp").toNumber(),
      };
      return fetched;
    })
    .then((data) => {
      res.status(200).send({
        message: "Request added successfully!",
        details: { ...data.reqDetails.properties, timestamp: data.timestamp },
      });
    })
    .catch((err) => console.log(err));
}

module.exports = router;
