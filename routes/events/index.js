const router = require("express").Router();

// Get All Event
router.use("/", require("./details"));
// Create an Event
// router.use("/create", require("./creation"));
// Register for a Event
// router.use("/resolve", require("./resolution"));
// Update Event details
// router.use("/update", require("./update"));
// Delete Event
// router.use("/delete", require("./delete"));

module.exports = router;
