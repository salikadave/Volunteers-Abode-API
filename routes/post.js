const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const query = require("../cypher");
const checkAuth = require("../middleware/checkAuth");

// FETCH ALL POSTS
router.get("/all", checkAuth, (req, res) => {
  req.neo4j
    .read(query("all-posts"))
    .then((result) => {
      let p = [];
      let u = [];
      let pts = [];
      result.records.forEach((row) => {
        p.push(row.get("p").properties);
        u.push(row.get("u").properties);
        pts.push(row.get("timestamp").toNumber());
      });
      let fetched = {
        p: p,
        u: u,
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
          data.p[i].createdBy = data.u[i]
        }
        postData = {
          posts: data.p
          // createdBy: data.u,
        };
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

// Create post --> check usertype and then select the cypher query
router.post("/", checkAuth, (req, res) => {
  const params = {
    creatorID: req.body.postedBy,
    postTitle: req.body.title,
    postBody: req.body.body,
    url: req.body.photo,
  };
  console.log(params);
  if (
    !params.url ||
    !params.creatorID ||
    !params.postTitle ||
    !params.postBody
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    switch (req.body.userType) {
      case 0:
        volunteerHandler(req, res, params);
        break;
      case 1:
        ngoHandler(req, res, params);
        break;
      default:
        console.log("Default statement switch");
        res.status(422).json({
          message: "User type not mentioned!",
        });
    }
  }
});

const volunteerHandler = (req, res, params) => {
  req.neo4j
    .write(query("create-post-volunteer"), params)
    .then((result) => result.records[0].get("p"))
    .then((data) => {
      res.status(200).send({
        message: "Post created successfully!",
        details: data.properties,
      });
    })
    .catch((err) => console.log(err));
};
const ngoHandler = (req, res, params) => {
  req.neo4j
    .write(query("create-post-ngo"), params)
    .then((result) => result.records[0].get("p"))
    .then((data) => {
      res.status(200).send({
        message: "Post created successfully!",
        details: data.properties,
      });
    })
    .catch((err) => console.log(err));
};

// edit post
router.put("/:postID", checkAuth, (req, res) => {
  const { ...properties } = req.body;
  let cypherParams = {
    id: req.params.postID,
    properties: properties,
  };
  //   res.send({ properties });
  req.neo4j
    .write(query("update-post"), cypherParams)
    .then((results) => results.records[0])
    .then((data) => {
      res.status(200).json({
        message: "Post updated successfully!",
        dataUpdated: data._fields[0].properties,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error occured in updating post details",
        err: err,
      });
    });
});

// delete post
router.delete("/:postID", checkAuth, (req, res) => {
  let cypherParams = {
    pID: req.params.postID,
    creatorID: req.body.userID,
  };
  req.neo4j
    .write(query("delete-post"), cypherParams)
    .then((results) => results.records[0])
    .then((data) => {
      res.status(200).json({
        message: "Post deleted successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error occured in deleting post",
        err: err,
      });
    });
});

module.exports = router;
