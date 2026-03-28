const express = require("express");
const router  = express.Router();
const postController = require("./post.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.use(verifyToken);

// Posts
router.post("/posts",       verifyToken,       postController.createPost);
router.get("/posts",  verifyToken,              postController.getPosts);
router.delete("/posts/:id",    verifyToken,     postController.deletePost);

// Likes
router.post("/posts/:id/like",   verifyToken,   postController.likePost);
router.delete("/posts/:id/like",  verifyToken,  postController.unlikePost);

// Comments
router.post("/posts/:id/comments", verifyToken, postController.addComment);
router.get("/posts/:id/comments", verifyToken,  postController.getComments);
router.delete("/comments/:id",  verifyToken,    postController.deleteComment);

module.exports = router;