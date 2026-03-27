const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/check_auth", authController.checkAuth);
router.post("/email_login", authController.emailLogin);
router.post("/phone_login", authController.phoneLogin);
router.post("/set_password", authController.setPassword);

router.post("/send_email_otp", authController.sendEmailOtp);

router.post("/verify_email_otp", authController.verifyEmailOtp);

router.post("/send_phone_otp", authController.sendPhoneOtp);

router.post("/verify_phone_otp", authController.verifyPhoneOtp);

module.exports = router;