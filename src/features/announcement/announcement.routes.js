const express = require("express");
const router  = express.Router();
const announcementController = require("./announcement.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.use(verifyToken);

// Must come before /:id to avoid route conflict
router.get("/announcements/active",  announcementController.getActiveAnnouncements);

router.post("/announcements",        announcementController.createAnnouncement);
router.get("/announcements",         announcementController.getAllAnnouncements);
router.put("/announcements/:id",     announcementController.updateAnnouncement);
router.delete("/announcements/:id",  announcementController.deleteAnnouncement);

module.exports = router;