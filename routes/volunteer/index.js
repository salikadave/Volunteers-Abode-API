const router = require("express").Router();

// Fetch volunteer node details
router.use("/get", require("./details"));
// Update volunteer details
router.use("/update", require("./update"));
// router.use("/delete", require("./delete"));

module.exports = router;
