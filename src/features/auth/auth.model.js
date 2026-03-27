const pool = require("../../config/db");

const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

const findByPhone = async (phone) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );
  return result.rows[0];
};

const setNewPassword = async (email, password) => {
  const result = await pool.query(
    `UPDATE users 
     SET password = $1, status = 'active'
     WHERE email = $2
     RETURNING id, email, role, society_id`,
    [password, email]
  );

  return result.rows[0];
};

module.exports = {
  findByEmail,
  findByPhone,
  setNewPassword
};