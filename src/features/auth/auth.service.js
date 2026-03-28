const authModel = require("./auth.model");
const hash = require("../../utils/hash");

const jwtUtil = require("../../utils/jwt");

const  otpStore = require("../../utils/otpStore");
// Check user exists
const checkAuth = async (email, phone, isEmailLogin) => {

  let user;

  if (isEmailLogin) {
    user = await authModel.findByEmail(email);
  } else {
    user = await authModel.findByPhone(phone);
  }

  if (!user) {
    return { exists: false };
  }

  if(!isEmailLogin) {
      const otp = "123456"; // dummy

    otpStore.saveOtp(phone, otp);
  }

  return {
    exists: true,
    status: user.status,
    role: user.role,
    society_id: user.society_id,
    id: user.id,
    email: user.email,
    phone: user.phone
  };
};


// Email login

const checkEmailLogin = async (email, password) => {

  const user = await authModel.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await hash.comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwtUtil.generateToken(user);

  return {
    message: "Login success",
    token: token,
    user: user
  };
};

// Phone login (OTP example)
const checkPhoneLogin = async (phone, otp) => {

   const valid = otpStore.verifyOtp(phone, otp);

  if (!valid) {
    throw new Error("Invalid or expired OTP");
  }



  const user = await authModel.findByPhone(phone);

  if (!user) {
    throw new Error("User not found");
  }

  // // Demo OTP
  // if (otp !== "123456") {
  //   throw new Error("Invalid OTP");
  // }


  const token = jwtUtil.generateToken(user);

    return {
    message: "Login success",
    token: token,
    user: user
    };
    
};


const setNewPassword = async (email, password) => {

  const user = await authModel.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status !== "pending") {
    throw new Error("Password already set");
  }

  const newHashPassword = await hash.hashPassword(password);

  const updatedUser = await authModel.setNewPassword(email, newHashPassword);

  return {
    message: "Password set successfully",
    user: updatedUser
  };
  
};

const sendEmailOtp = async (email) => {

  const otp = "123456"; // dummy

  otpStore.saveOtp(email, otp);

  console.log("Email OTP:", otp);

  return {
    message: "OTP sent to email",
    success: true
  };
};

const verifyEmailOtp = async (email, otp) => {

  const valid = otpStore.verifyOtp(email, otp);

  if (!valid) {
    throw new Error("Invalid or expired OTP");
  }

  return {
    message: "Email verified successfully",
     success: true
  };
};

const sendPhoneOtp = async (phone) => {

  const otp = "123456";

  otpStore.saveOtp(phone, otp);

  console.log("Phone OTP:", otp);

  return {
    message: "OTP sent to phone",
     success: true
  };
};

const verifyPhoneOtp = async (phone, otp) => {

  const valid = otpStore.verifyOtp(phone, otp);

  if (!valid) {
    throw new Error("Invalid or expired OTP");
  }

  return {
    message: "Phone verified successfully",
     success: true
  };
};

module.exports = {
  checkAuth,
  checkEmailLogin,
  checkPhoneLogin,
  setNewPassword,

  verifyPhoneOtp,
  sendPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp

};