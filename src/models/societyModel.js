const pool = require("../config/db");
const hash = require("./../utils/hash");
const jwtUtil = require("../utils/jwt");
// Get all societies with admin info
const getAllSocieties = async () => {
  const result = await pool.query(`
    SELECT s.id, s.name, s.address, s.status, s.description, s.created_at,
           u.id AS admin_id, u.name AS admin_name, u.email AS admin_email, u.phone AS admin_phone
    FROM societies s
    LEFT JOIN users u ON s.admin_id = u.id
  `);
  return result.rows;
};

// Create society + admin user
const createSociety = async (admin, society) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Step 1: Insert society without admin_id
    const societyResult = await client.query(
      `INSERT INTO societies (name, address, status, description) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [society.name, society.address, society.status || 'pending', society.description]
    );
    const societyId = societyResult.rows[0].id;


    var newHashPassword = await hash.hashPassword(admin.password);

    // Step 2: Insert admin user linked to society
    const adminResult = await client.query(
      `INSERT INTO users (name, email,phone, password, society_id, role, status)
       VALUES ($1, $2, $3, $4, $5, 'admin', 'pending') RETURNING id`,
      [admin.name, admin.email,admin.phone, newHashPassword, societyId]
    );
    const adminId = adminResult.rows[0].id;

    // Step 3: Update society with admin_id
    await client.query(
      `UPDATE societies SET admin_id = $1 WHERE id = $2`,
      [adminId, societyId]
    );

    await client.query("COMMIT");

    const token = jwtUtil.generateToken({
      id: adminId,
      role: "admin",
      society_id: societyId
    });

    return {
      token: token,
      society: { id: societyId, ...society, admin_id: adminId },
      admin: { id: adminId, ...admin, society_id: societyId }
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


const getSocietyById = async (id) => {

  const result = await pool.query(`
    SELECT s.id, s.name, s.address, s.status, s.description,
           u.name AS admin_name, u.email AS admin_email
    FROM societies s
    LEFT JOIN users u ON s.admin_id = u.id
    WHERE s.id = $1
  `, [id]);

  return result.rows[0];
};


// Update society
const updateSociety = async (id, society) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (let key in society) {
    fields.push(`${key} = $${i}`);
    values.push(society[key]);
    i++;
  }
  values.push(id);

  const result = await pool.query(
    `UPDATE societies SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values
  );
  return result.rows[0];
};


// Delete society
const deleteSociety = async (id) => {
  const result = await pool.query("DELETE FROM societies WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = { getAllSocieties, createSociety, updateSociety, deleteSociety,getSocietyById };