const router = require("express").Router();

// Fetch NGO details
router.use("/get", require("./details"));
// Update ngoadmin details
router.use("/update", require("./update"));
// router.use("/delete", require("./delete"));

module.exports = router;
