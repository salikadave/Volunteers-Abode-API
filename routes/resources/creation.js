const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const query = require("../../cypher");
const checkAuth = require("../../middleware/checkAuth");

// Create Request
router.post("/", checkAuth, (req, res) => {
  const params = {
    creatorID: req.body.reqBy,
    catArr: req.body.categories,
    reqTitle: req.body.title,
    reqDetails: req.body.details,
    amtArr: req.body.amtRequired,
    count: req.body.volCount,
    coordsArr: req.body.mapCoords,
    img: req.body.imageURL,
    isResolved: false || req.body.isResolved,
  };
  if (
    !params.img ||
    !params.creatorID ||
    !params.reqTitle ||
    !params.amtArr ||
    !params.catArr
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    req.neo4j
      .write(query("create-request-volunteer"), params)
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
});

module.exports = router;
