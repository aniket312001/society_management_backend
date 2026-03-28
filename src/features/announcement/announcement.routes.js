const express = require("express");
const router  = express.Router();
const announcementController = require("./announcement.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.use(verifyToken);

// Must come before /:id to avoid route conflict
router.get("/announcements/active",  announcementController.getActiveAnnouncements);

router.post("/announcements",    verifyToken,    announcementController.createAnnouncement);
router.get("/announcements",       verifyToken,   announcementController.getAllAnnouncements);
router.put("/announcements/:id",   verifyToken,   announcementController.updateAnnouncement);
router.delete("/announcements/:id", verifyToken,  announcementController.deleteAnnouncement);

module.exports = router;