const otpStore = {};

// Email → SendGrid / AWS SES
// Phone → Twilio / MSG91 / Fast2SMS
// OTP store → Redis

const saveOtp = (key, otp) => {
  otpStore[key] = {
    otp,
    createdAt: Date.now(),
  };
};

const verifyOtp = (key, otp) => {
  const record = otpStore[key];

  if (!record) return false;

  if (record.otp !== otp) return false;

  // expire after 5 minutes
  const isExpired = Date.now() - record.createdAt > 5 * 60 * 1000;

  if (isExpired) {
    delete otpStore[key];
    return false;
  }

  delete otpStore[key];
  return true;
};

module.exports = {
  saveOtp,
  verifyOtp,
};