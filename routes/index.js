const router = require("express").Router();

// Authenticate user
router.use("/auth", require("./userAuth"));
router.use("/volunteer", require("./volunteer"));
router.use("/ngoadmin", require("./ngoadmin"));
router.use("/posts", require("./post"));

module.exports = router;
