const authModel = require("../models/authModel");
const hash = require("../utils/hash");

const jwtUtil = require("../utils/jwt");
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

  return {
    exists: true,
    status: user.status,
    role: user.role,
    society_id: user.society_id
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
    user: {
      id: user.id,
      role: user.role,
      society_id: user.society_id
    }
  };
};

// Phone login (OTP example)
const checkPhoneLogin = async (phone, otp) => {

  const user = await authModel.findByPhone(phone);

  if (!user) {
    throw new Error("User not found");
  }

  // Demo OTP
  if (otp !== "1234") {
    throw new Error("Invalid OTP");
  }


  const token = jwtUtil.generateToken(user);

    return {
    message: "Login success",
    token: token,
    user: {
        id: user.id,
        role: user.role,
        society_id: user.society_id
    }
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

module.exports = {
  checkAuth,
  checkEmailLogin,
  checkPhoneLogin,
  setNewPassword
};