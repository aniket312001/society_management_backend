const pool = require("../config/db");

// CREATE a new user
const addUser = async (user) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, society_id, role, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      user.name,
      user.email,
      user.password,
      user.society_id,
      user.role || 'member',
      user.status || 'pending'
    ]
  );
  return result.rows[0];
};

// READ all users in a society
const getUsersBySociety = async (societyId) => {
  const result = await pool.query(
    `SELECT id, name, email, role, status, created_at 
     FROM users WHERE society_id = $1`,
    [societyId]
  );
  return result.rows;
};

// UPDATE user
const updateUser = async (id, user) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (let key in user) {
    fields.push(`${key} = $${i}`);
    values.push(user[key]);
    i++;
  }
  values.push(id);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values
  );
  return result.rows[0];
};

// DELETE user
const deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = { addUser, getUsersBySociety, updateUser, deleteUser };