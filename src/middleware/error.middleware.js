const handleDbError = require("../helpers/dbErrorHandler");
const AppError = require("../exceptions/app.error");

// Map plain error messages (from services) → { statusCode, field }
const knownErrors = {
  // auth
  "User not found":            { statusCode: 404 },
  "Invalid password":          { statusCode: 401, field: "password" },
  "Invalid or expired OTP":    { statusCode: 400, field: "otp" },
  "Password already set":      { statusCode: 400 },

  // society
  "Admin with this email or phone already exists": { statusCode: 400, field: "email" },

  // visitor
  "Status must be 'approved' or 'rejected'": { statusCode: 400, field: "status" },

  // post
  "Already liked":   { statusCode: 409 },
  "Like not found":  { statusCode: 404 },

  // announcement
  "end_date must be on or after start_date": { statusCode: 400, field: "end_date" },
};

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR 💥:", err);

  // 1. DB errors (postgres error codes)
  if (err.code) {
    err = handleDbError(err);
  }

  // 2. Already an AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      field: err.field || null,
    });
  }

  // 3. Plain Error with a known message (thrown from services)
  if (err instanceof Error && knownErrors[err.message]) {
    const { statusCode, field = null } = knownErrors[err.message];
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      field,
    });
  }

  // 4. Unknown error
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

module.exports = errorMiddleware;