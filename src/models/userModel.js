
//This contains SQL queries only.
//Talk directly to PostgreSQL.

const pool = require("../config/db");

const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const createUser = async (name, email) => {
  const result = await pool.query(
    "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
};

module.exports = { getAllUsers, createUser };