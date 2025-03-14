var express = require("express");
var router = express.Router();
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  getFavoritePostsOfUser,
  getPostsCreatedByUser,
  getPostsFiltered,
  likePost,
  unlikePost,
  dislikePost,
  undislikePost,
  savePost,
  unsavePost,
} = require("../services/posts");
const { authMiddleware } = require("../middleware/authenticate");
const {
  checkIsPostOwner,
  checkIsPostOwnerOrAdmin,
} = require("../middleware/posts");

router.get("/user/:id", getPostsCreatedByUser);
router.get("/favorites", authMiddleware, getFavoritePostsOfUser);
router.post("/filtered", getPostsFiltered);

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, checkIsPostOwner, updatePost);
router.delete("/:id", authMiddleware, checkIsPostOwnerOrAdmin, deletePost);

router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/unlike", authMiddleware, unlikePost);
router.post("/:id/dislike", authMiddleware, dislikePost);
router.post("/:id/undislike", authMiddleware, undislikePost);
router.post("/:id/save", authMiddleware, savePost);
router.post("/:id/unsave", authMiddleware, unsavePost);

module.exports = router;
