const pool = require("../../config/db");

const createAnnouncement = async (data) => {
  const result = await pool.query(
    `INSERT INTO announcements (society_id, created_by, title, body, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.society_id, data.created_by, data.title, data.body, data.start_date, data.end_date]
  );
  return result.rows[0];
};

// Only announcements whose window includes today
const getActiveAnnouncements = async (societyId) => {
  const result = await pool.query(
    `SELECT a.*, u.name AS created_by_name
     FROM announcements a
     JOIN users u ON a.created_by = u.id
     WHERE a.society_id = $1
       AND CURRENT_DATE BETWEEN a.start_date AND a.end_date
     ORDER BY a.created_at DESC`,
    [societyId]
  );
  return result.rows;
};

// All announcements (admin management view)
const getAllAnnouncements = async (societyId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT a.*, u.name AS created_by_name
     FROM announcements a
     JOIN users u ON a.created_by = u.id
     WHERE a.society_id = $1
     ORDER BY a.created_at DESC
     LIMIT $2 OFFSET $3`,
    [societyId, limit, offset]
  );
  return result.rows;
};

const getAnnouncementById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM announcements WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateAnnouncement = async (id, data) => {
  const result = await pool.query(
    `UPDATE announcements
     SET title = $1, body = $2, start_date = $3, end_date = $4
     WHERE id = $5
     RETURNING *`,
    [data.title, data.body, data.start_date, data.end_date, id]
  );
  return result.rows[0];
};

const deleteAnnouncement = async (id) => {
  const result = await pool.query(
    `DELETE FROM announcements WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};