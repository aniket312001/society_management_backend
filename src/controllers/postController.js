const postService = require("../services/postService");

// ─── Posts ────────────────────────────────────────────────────

// POST /posts — any member
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ field: "content", message: "Content is required" });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({ field: "content", message: "Content max 2000 characters" });
    }

    const post = await postService.createPost({
      society_id: req.user.society_id,
      user_id:    req.user.id,
      content:    content.trim(),
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /posts — paginated feed for the society
const getPosts = async (req, res) => {
  try {
    const { society_id, id: userId } = req.user;
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await postService.getPosts(society_id, page, limit, userId);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /posts/:id — post owner or admin
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await postService.removePost(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Likes ────────────────────────────────────────────────────

// POST /posts/:id/like
const likePost = async (req, res) => {
  try {
    const result = await postService.likePost(req.params.id, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "Already liked") {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /posts/:id/like
const unlikePost = async (req, res) => {
  try {
    const result = await postService.unlikePost(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "Like not found") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Comments ─────────────────────────────────────────────────

// POST /posts/:id/comments
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ field: "content", message: "Content is required" });
    }

    const comment = await postService.addComment({
      post_id: req.params.id,
      user_id: req.user.id,
      content: content.trim(),
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /posts/:id/comments
const getComments = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const comments = await postService.getComments(req.params.id, page, limit);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /comments/:id — comment owner or admin
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await postService.getCommentById(id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await postService.removeComment(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  deleteComment,
};