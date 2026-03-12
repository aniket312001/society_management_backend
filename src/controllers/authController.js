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



const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.checkEmailLogin(email, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const phoneLogin = async (req, res) => {
  try {
    const { phone, otp } = req.params;
   
    const result = await authService.checkPhoneLogin(phone, otp);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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


module.exports = { checkAuth, emailLogin, phoneLogin, setPassword};