const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");

const Post = mongoose.model("Post");

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id userName")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", checkAuth, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ error: "Plase add all the fields" });
  }

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", checkAuth, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id userName")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
