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
  getPostsByCategory,
  getPostsFiltered,
  likePost,
  unlikePost,
  dislikePost,
  undislikePost,
  savePost,
  unsavePost,
  commentOnPost,
} = require("../services/posts");
const { authMiddleware } = require("../middleware/authenticate");
const {
  checkIsPostOwner,
  checkIsPostOwnerOrAdmin,
} = require("../middleware/posts");

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get paginated list of posts
 *     description: Fetches a paginated list of posts from the database.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve (default is 1).
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of posts per page (default is 10).
 *     responses:
 *       200:
 *         description: A paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, checkIsPostOwner, updatePost);
router.delete("/:id", authMiddleware, checkIsPostOwnerOrAdmin, deletePost);

router.get("/user/:id", getPostsCreatedByUser);
router.get("/favorites", authMiddleware, getFavoritePostsOfUser);
router.get("/category/:id", getPostsByCategory);
router.get("/filtered", getPostsFiltered);

router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/unlike", authMiddleware, unlikePost);
router.post("/:id/dislike", authMiddleware, dislikePost);
router.post("/:id/undislike", authMiddleware, undislikePost);
router.post("/:id/save", authMiddleware, savePost);
router.post("/:id/unsave", authMiddleware, unsavePost);

router.post("/:id/comment", authMiddleware, commentOnPost);
module.exports = router;
