const router = require("express").Router();
const shelvesRoutes = require("./shelves");

// Article routes
router.use("/shelves", shelvesRoutes);

module.exports = router;