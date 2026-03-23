const express = require("express");
const router  = express.Router();
const visitorController = require("../controllers/visitorController");
const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);

router.post("/visitors",                  visitorController.addVisitor);
router.get("/visitors",                   visitorController.getVisitors);
router.patch("/visitors/:id/status",      visitorController.updateStatus);
router.delete("/visitors/:id",            visitorController.deleteVisitor);

module.exports = router;