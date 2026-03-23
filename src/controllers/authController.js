const authService = require("../services/authService");

const checkAuth = async (req, res) => {
  try {
    // this function will check if email or phone user is exist or not and if it will return {newUser: true or false } it will help to set new password
    // compare with status
    const {email, phone, isEmailLogin} = req.body;

    const result = await authService.checkAuth(email, phone, isEmailLogin);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const sendEmailOtp = async (req, res) => {
  try {

    const { email } = req.body;
    console.log("email ", email);

    const result = await authService.sendEmailOtp(email);

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmailOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const result = await authService.verifyEmailOtp(email, otp);

    res.json(result);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }
};

const sendPhoneOtp = async (req, res) => {

  try {

    const { phone } = req.body;

    const result = await authService.sendPhoneOtp(phone);

    res.json(result);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

const verifyPhoneOtp = async (req, res) => {

  try {

    const { phone, otp } = req.body;

    const result = await authService.verifyPhoneOtp(phone, otp);

    res.json(result);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }
};


const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.checkEmailLogin(email, password);
    res.json(result);
  } catch (error) {
    console.error("error - ", error);
    res.status(500).json({ message: error.message || "Something went wrong", });
  }
};

const phoneLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log("phone otp ", phone);
   
    const result = await authService.checkPhoneLogin(phone, otp);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong", });
  }
};

const setPassword = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await authService.setNewPassword(email, password);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { checkAuth, emailLogin, phoneLogin, setPassword, sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp};