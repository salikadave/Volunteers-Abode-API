const router = require("express").Router();

// Authenticate user
router.use("/auth", require("./userAuth"));

module.exports = router;
