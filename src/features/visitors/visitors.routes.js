const express = require("express");
const router  = express.Router();
const visitorController = require("./visitors.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.use(verifyToken);

router.post("/visitors",    verifyToken,              visitorController.addVisitor);
router.get("/visitors",   verifyToken,                 visitorController.getVisitors);
router.patch("/visitors/:id",   verifyToken,    visitorController.updateVisitors);
router.patch("/visitors/:id/status",   verifyToken,    visitorController.updateStatus);
router.delete("/visitors/:id",    verifyToken,         visitorController.deleteVisitor);

module.exports = router;