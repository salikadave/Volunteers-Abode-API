const router = require("express").Router();

// Get All Event
router.use("/", require("./details"));
// Create / Register for an Event
router.use("/create", require("./creation"));
// Update Event details
router.use("/update", require("./update"));
// Delete Event
router.use("/delete", require("./delete"));

module.exports = router;
