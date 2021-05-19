const router = require("express").Router();

// Get All Requests
router.use("/", require("./details"));
// Open a Resource Request
router.use("/create", require("./creation"));
// Resolve a Resource Request
router.use("/resolve", require("./resolution"));
// Update request details
router.use("/update", require("./update"));
// Delete request
router.use("/delete", require("./delete"));

module.exports = router;
