const pool = require("../config/db");

const hash = require("./../utils/hash");
const jwtUtil = require("../utils/jwt");

// CREATE a new user
const addUser = async (user) => {
  const result = await pool.query(
    `INSERT INTO users (name, email,phone, password, society_id, role, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      user.name,
      user.email,
      user.phone,
      user.password,
      user.society_id,
      user.role || 'member',
      user.status || 'pending'
    ]
  );

  return result.rows[0];
};

// READ all users in a society
const getUsersBySociety = async (societyId, page, limit, filters) => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, name, email, phone, role, status, created_at
    FROM users
    WHERE society_id = $1
  `;

  let values = [societyId];
  let index = 2;

  // 🔥 FILTERS
  if (filters.status) {
    query += ` AND status = $${index}`;
    values.push(filters.status);
    index++;
  }

  if (filters.role) {
    query += ` AND role = $${index}`;
    values.push(filters.role);
    index++;
  }

  if (filters.search) {
    query += ` AND (
      name ILIKE $${index} OR 
      email ILIKE $${index} OR 
      phone ILIKE $${index}
    )`;
    values.push(`%${filters.search}%`);
    index++;
  }

  // Sorting
  query += ` ORDER BY created_at DESC`;

  // Pagination
  query += ` LIMIT $${index} OFFSET $${index + 1}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);

  return result.rows;
};


const updatePassword = async (id, password) => {

   var newHashPassword = await hash.hashPassword(password);
    
  const result = await pool.query(
  `UPDATE users 
   SET password = $1, status = $2 
   WHERE id = $3 
   RETURNING *`,
  [newHashPassword, 'active', id]
);
  const user = result.rows[0];
  const token = jwtUtil.generateToken({
        id: id,
        role: user.role,
        society_id: user.society_id
    });

  return  {
    "token": token,
    "user": user
  };
}

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


const getUserById = async (id) => {

  const result = await pool.query(
    `SELECT id, name, email, phone, role, status, society_id, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

module.exports = { addUser, getUsersBySociety, updateUser, deleteUser,getUserById, updatePassword };