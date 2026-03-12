const express = require("express");
const router = express.Router();
const societyController = require("../controllers/societyController");
const verifyToken = require("../middleware/authMiddleware");
// CRUD APIs
router.get("/society",verifyToken, societyController.getSocieties);
router.post("/society", societyController.createSociety);
router.get("/my-society", verifyToken, societyController.getMySociety);
router.put("/society/:id",verifyToken, societyController.updateSocieties);
router.delete("/society/:id",verifyToken, societyController.deleteSocieties);

module.exports = router;