const postService = require("./post.service");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../exceptions/app.error");
const createPost = asyncHandler(async (req, res) => {
  const { content, file_url, file_type } = req.body;

  if (!content?.trim())
    throw new AppError("Content is required", 400, "content");

  if (content.trim().length > 2000)
    throw new AppError("Content max 2000 characters", 400, "content");

  // Validate file_type if provided
  if (file_type && !["image", "video"].includes(file_type))
    throw new AppError("file_type must be 'image' or 'video'", 400, "file_type");

  // file_url required if file_type is given, and vice versa
  if (file_url && !file_type)
    throw new AppError("file_type is required when file_url is provided", 400, "file_type");

  if (file_type && !file_url)
    throw new AppError("file_url is required when file_type is provided", 400, "file_url");

  const post = await postService.createPost({
    society_id: req.user.society_id,
    user_id:    req.user.id,
    content:    content.trim(),
    file_url:   file_url  ?? null,
    file_type:  file_type ?? null,
  });

  res.status(201).json({ success: true, data: post });
});

const getPosts = asyncHandler(async (req, res) => {
  const { society_id, id: userId } = req.user;
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;

  const posts = await postService.getPosts(society_id, page, limit, userId);
  res.json({ success: true, data: posts });
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await postService.getPostById(id);

  if (!post) throw new AppError("Post not found", 404);

  const isOwner = post.user_id === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin)
    throw new AppError("Not authorized", 403);

  const result = await postService.removePost(id);
  res.json({ success: true, data: result });
});

const likePost = asyncHandler(async (req, res) => {
  const result = await postService.likePost(req.params.id, req.user.id);
  res.status(201).json({ success: true, data: result });
});

const unlikePost = asyncHandler(async (req, res) => {
  const result = await postService.unlikePost(req.params.id, req.user.id);
  res.json({ success: true, data: result });
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim())
    throw new AppError("Content is required", 400, "content");

  const comment = await postService.addComment({
    post_id:  req.params.id,
    user_id:  req.user.id,
    content:  content.trim(),
  });

  res.status(201).json({ success: true, data: comment });
});

const getComments = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;

  const comments = await postService.getComments(req.params.id, page, limit);
  res.json({ success: true, data: comments });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await postService.getCommentById(id);

  if (!comment) throw new AppError("Comment not found", 404);

  const isOwner = comment.user_id === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin)
    throw new AppError("Not authorized", 403);

  const result = await postService.removeComment(id);
  res.json({ success: true, data: result });
});

module.exports = {
  createPost, getPosts, deletePost,
  likePost, unlikePost,
  addComment, getComments, deleteComment,
};