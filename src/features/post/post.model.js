const pool = require("../../config/db");

// ─── Posts ───────────────────────────────────────────────────

const createPost = async (data) => {
  const result = await pool.query(
    `INSERT INTO posts (society_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.society_id, data.user_id, data.content]
  );
  return result.rows[0];
};

const getPostsBySociety = async (societyId, page, limit, requestingUserId) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT
       p.*,
       u.name         AS author_name,
       COUNT(DISTINCT pl.id)  AS like_count,
       COUNT(DISTINCT pc.id)  AS comment_count,
       BOOL_OR(pl.user_id = $3) AS liked_by_me
     FROM posts p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN post_likes    pl ON pl.post_id = p.id
     LEFT JOIN post_comments pc ON pc.post_id = p.id
     WHERE p.society_id = $1
     GROUP BY p.id, u.name
     ORDER BY p.created_at DESC
     LIMIT $4 OFFSET $5`,
    [societyId, societyId, requestingUserId, limit, offset]
  );
  return result.rows;
};

const getPostById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, u.name AS author_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

const deletePost = async (id) => {
  const result = await pool.query(
    `DELETE FROM posts WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// ─── Likes ───────────────────────────────────────────────────

const likePost = async (postId, userId) => {
  const result = await pool.query(
    `INSERT INTO post_likes (post_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (post_id, user_id) DO NOTHING
     RETURNING *`,
    [postId, userId]
  );
  return result.rows[0]; // null if already liked
};

const unlikePost = async (postId, userId) => {
  const result = await pool.query(
    `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2 RETURNING *`,
    [postId, userId]
  );
  return result.rows[0];
};

// ─── Comments ────────────────────────────────────────────────

const addComment = async (data) => {
  const result = await pool.query(
    `INSERT INTO post_comments (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.post_id, data.user_id, data.content]
  );
  return result.rows[0];
};

const getCommentsByPost = async (postId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT pc.*, u.name AS author_name
     FROM post_comments pc
     JOIN users u ON pc.user_id = u.id
     WHERE pc.post_id = $1
     ORDER BY pc.created_at ASC
     LIMIT $2 OFFSET $3`,
    [postId, limit, offset]
  );
  return result.rows;
};

const getCommentById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM post_comments WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const deleteComment = async (id) => {
  const result = await pool.query(
    `DELETE FROM post_comments WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createPost,
  getPostsBySociety,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getCommentsByPost,
  getCommentById,
  deleteComment,
};