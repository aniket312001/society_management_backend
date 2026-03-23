const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");


// CREATE user
router.post("/user",verifyToken, userController.addUser);

// READ users by society
router.get("/users",verifyToken, userController.getUsers);

// UPDATE user
router.patch("/user/:id",verifyToken, userController.updateUser);
router.patch("/user-reset-password/:id", userController.updatePassword);

// DELETE user
router.delete("/user/:id",verifyToken, userController.deleteUser);


router.get("/me", verifyToken, userController.getMyProfile);

module.exports = router;