const router = require("express").Router();

// Fetch event details
router.use("/get", require("./details"));
// Update volunteer details
// router.use("/update", require("./update"));
// // Delete Volunteer
// router.use("/delete", require("./delete"));

module.exports = router;
