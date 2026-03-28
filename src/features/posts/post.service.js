const postModel = require("./post.model");
// ─── Posts ────────────────────────────────────────────────────

const createPost = async (data) => {
  return await postModel.createPost(data);
};

const getPosts = async (societyId, page, limit, requestingUserId) => {
  return await postModel.getPostsBySociety(societyId, page, limit, requestingUserId);
};

const removePost = async (id) => {
  return await postModel.deletePost(id);
};

// ─── Likes ────────────────────────────────────────────────────

const likePost = async (postId, userId) => {
  const result = await postModel.likePost(postId, userId);
  if (!result) throw new Error("Already liked");
  return result;
};

const unlikePost = async (postId, userId) => {
  const result = await postModel.unlikePost(postId, userId);
  if (!result) throw new Error("Like not found");
  return result;
};

// ─── Comments ─────────────────────────────────────────────────

const addComment = async (data) => {
  return await postModel.addComment(data);
};

const getComments = async (postId, page, limit) => {
  return await postModel.getCommentsByPost(postId, page, limit);
};

const removeComment = async (commentId) => {
  return await postModel.deleteComment(commentId);
};

const getCommentById = async (id) => {
  return await postModel.getCommentById(id);
};

const getPostById = async (id) => {
  return await postModel.getPostById(id);
};

module.exports = {
  createPost,
  getPosts,
  removePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  removeComment,
  getCommentById,
  getPostById,
};