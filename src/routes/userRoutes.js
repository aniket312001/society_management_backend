const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");


// CREATE user
router.post("/user",verifyToken, userController.addUser);

// READ users by society
router.get("/users/:societyId",verifyToken, userController.getUsers);

// UPDATE user
router.put("/user/:id",verifyToken, userController.updateUser);

// DELETE user
router.delete("/user/:id",verifyToken, userController.deleteUser);


router.get("/me", verifyToken, userController.getMyProfile);

module.exports = router;