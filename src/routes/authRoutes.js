const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/check_auth", authController.checkAuth);
router.post("/email_login", authController.emailLogin);
router.post("/phone_login", authController.phoneLogin);
router.post("/set_password", authController.setPassword);

module.exports = router;