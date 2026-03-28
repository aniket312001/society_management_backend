const pool = require("../../config/db");

const createVisitor = async (visitor) => {
  const result = await pool.query(
    `INSERT INTO visitors (society_id, added_by, name, phone, purpose, visit_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending')
     RETURNING *`,
    [visitor.society_id, visitor.added_by, visitor.name, visitor.phone, visitor.purpose, visitor.visit_date]
  );
  return result.rows[0];
};

const updateVisitor = async (id, visitor) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  // Build dynamic update query safely
  if (visitor.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(visitor.name);
  }
  if (visitor.phone !== undefined) {
    fields.push(`phone = $${paramIndex++}`);
    values.push(visitor.phone);
  }
  if (visitor.purpose !== undefined) {
    fields.push(`purpose = $${paramIndex++}`);
    values.push(visitor.purpose);
  }
  if (visitor.visit_date !== undefined) {
    fields.push(`visit_date = $${paramIndex++}`);
    values.push(visitor.visit_date);
  }
  if (visitor.society_id !== undefined) {
    fields.push(`society_id = $${paramIndex++}`);
    values.push(visitor.society_id);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id); // for WHERE clause

  const query = `
    UPDATE visitors 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getVisitorsBySociety = async (societyId, page, limit, filters) => {
  const offset = (page - 1) * limit;
  let query = `
    SELECT v.*, u.name AS added_by_name
    FROM visitors v
    JOIN users u ON v.added_by = u.id
    WHERE v.society_id = $1
  `;
  const values = [societyId];
  let i = 2;

  if (filters.status) {
    query += ` AND v.status = $${i}`;
    values.push(filters.status);
    i++;
  }

  if (filters.date) {
    query += ` AND v.visit_date = $${i}`;
    values.push(filters.date);
    i++;
  }

  if (filters.search) {
    query += ` AND (v.name ILIKE $${i} OR v.phone ILIKE $${i})`;
    values.push(`%${filters.search}%`);
    i++;
  }

  query += ` ORDER BY v.created_at DESC LIMIT $${i} OFFSET $${i + 1}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

const getVisitorById = async (id) => {
  const result = await pool.query(
    `SELECT v.*, u.name AS added_by_name
     FROM visitors v
     JOIN users u ON v.added_by = u.id
     WHERE v.id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateVisitorStatus = async (id, status, note) => {
  const result = await pool.query(
    `UPDATE visitors SET status = $1, note = $2 WHERE id = $3 RETURNING *`,
    [status, note || null, id]
  );
  return result.rows[0];
};

const deleteVisitor = async (id) => {
  const result = await pool.query(
    `DELETE FROM visitors WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = { createVisitor, getVisitorsBySociety, getVisitorById, updateVisitorStatus, deleteVisitor,updateVisitor };