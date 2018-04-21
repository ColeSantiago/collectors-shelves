const router = require("express").Router();
const articleRoutes = require("./shelves");

// Article routes
router.use("/shelves", shelvesRoutes);

module.exports = router;