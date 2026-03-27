const authService = require("./auth.service");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../exceptions/app.error");

const checkAuth = asyncHandler(async (req, res) => {
  const { email, phone, isEmailLogin } = req.body;

  if (!email && !phone)
    throw new AppError("Email or Phone is required", 400);

  const result = await authService.checkAuth(email, phone, isEmailLogin);
  res.json({ success: true, data: result });
});

const sendEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim())
    throw new AppError("Email is required", 400, "email");

  const result = await authService.sendEmailOtp(email.trim());
  res.json({ success: true, data: result });
});

const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email?.trim()) throw new AppError("Email is required", 400, "email");
  if (!otp?.trim())   throw new AppError("OTP is required", 400, "otp");

  const result = await authService.verifyEmailOtp(email.trim(), otp);
  res.json({ success: true, data: result });
});

const sendPhoneOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone?.trim())
    throw new AppError("Phone is required", 400, "phone");

  const result = await authService.sendPhoneOtp(phone.trim());
  res.json({ success: true, data: result });
});

const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone?.trim()) throw new AppError("Phone is required", 400, "phone");
  if (!otp?.trim())   throw new AppError("OTP is required", 400, "otp");

  const result = await authService.verifyPhoneOtp(phone.trim(), otp);
  res.json({ success: true, data: result });
});

const emailLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim())    throw new AppError("Email is required", 400, "email");
  if (!password?.trim()) throw new AppError("Password is required", 400, "password");

  const result = await authService.checkEmailLogin(email.trim(), password);
  res.json({ success: true, data: result });
});

const phoneLogin = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone?.trim()) throw new AppError("Phone is required", 400, "phone");
  if (!otp?.trim())   throw new AppError("OTP is required", 400, "otp");

  const result = await authService.checkPhoneLogin(phone.trim(), otp);
  res.json({ success: true, data: result });
});

const setPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim())    throw new AppError("Email is required", 400, "email");
  if (!password?.trim()) throw new AppError("Password is required", 400, "password");

  if (password.length < 6)
    throw new AppError("Password must be at least 6 characters", 400, "password");

  const result = await authService.setNewPassword(email.trim(), password);
  res.json({ success: true, data: result });
});

module.exports = {
  checkAuth,
  emailLogin,
  phoneLogin,
  setPassword,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
};