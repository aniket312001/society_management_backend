const express = require("express");
const router = express.Router();
const societyController = require("../controllers/societyController");

// CRUD APIs
router.get("/society", societyController.getSocieties);
router.post("/society", societyController.createSociety);
router.put("/society/:id", societyController.updateSocieties);
router.delete("/society/:id", societyController.deleteSocieties);

module.exports = router;