const express = require("express");
const router  = express.Router();
const visitorController = require("./visitors.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.use(verifyToken);

router.post("/visitors",                  visitorController.addVisitor);
router.get("/visitors",                   visitorController.getVisitors);
router.patch("/visitors/:id/status",      visitorController.updateStatus);
router.delete("/visitors/:id",            visitorController.deleteVisitor);

module.exports = router;