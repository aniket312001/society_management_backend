const express = require("express");
const router  = express.Router();
const postController = require("./post.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.use(verifyToken);

// Posts
router.post("/posts",              postController.createPost);
router.get("/posts",               postController.getPosts);
router.delete("/posts/:id",        postController.deletePost);

// Likes
router.post("/posts/:id/like",     postController.likePost);
router.delete("/posts/:id/like",   postController.unlikePost);

// Comments
router.post("/posts/:id/comments", postController.addComment);
router.get("/posts/:id/comments",  postController.getComments);
router.delete("/comments/:id",     postController.deleteComment);

module.exports = router;