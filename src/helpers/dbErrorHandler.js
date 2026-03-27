const AppError = require("../exceptions/app.error");

const handleDbError = (err) => {
  // UNIQUE constraint
  if (err.code === "23505") {
    if (err.constraint === "users_phone_key") {
      return new AppError("Phone already exists", 400, "phone");
    }

    if (err.constraint === "users_email_key") {
      return new AppError("Email already exists", 400, "email");
    }

    return new AppError(`Duplicate value ${err.constraint}`, 400);
  }

  // FOREIGN KEY error
  if (err.code === "23503") {
    return new AppError("Invalid reference data", 400);
  }

  return new AppError("Internal server error", 500);
};

module.exports = handleDbError;