const router = require("express").Router();

// Fetch volunteer nodec details
router.use("/get", require("./details"));
// router.use("/update", require("./update"));
// router.use("/delete", require("./delete"));

module.exports = router;
