const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CREATE user
router.post("/user", userController.addUser);

// READ users by society
router.get("/users/:societyId", userController.getUsers);

// UPDATE user
router.put("/user/:id", userController.updateUser);

// DELETE user
router.delete("/user/:id", userController.deleteUser);

module.exports = router;