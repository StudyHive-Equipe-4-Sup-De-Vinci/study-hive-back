const authenticateRoutes = require("./authenticate");
const postRoutes = require("./posts");
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

function initRoutes(app) {
  app.use(cors(corsOptions));
  app.use("/", authenticateRoutes);
  app.use("/api/posts", postRoutes);
}

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Operations related to posts
 *   - name: Authenticate
 *     description: Operations related to authentication
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve all posts with pagination. Default page is 1 and page size is 10. providing page number and page size is not implemented yet.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts with pagination data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     description: Create a post. User needs to be authenticated.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *                 example: "My First Post"
 *               description:
 *                 type: string
 *                 description: Description of the post
 *                 example: "This is a description of the post."
 *               content_link:
 *                 type: string
 *                 description: Link to the content
 *                 example: "http://example.com/content"
 *               category_id:
 *                 type: integer
 *                 description: ID of the category the post belongs to
 *                 example: 1
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request, invalid data
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retrieve a specific post
 *     description: Retrieve a post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a specific post (title, description, content_link, category_id).
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content_link:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid data provided
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/favorites:
 *   get:
 *     summary: Get favorite posts of a user
 *     description: Get all posts marked as favorite by the authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of favorite posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/user/{id}:
 *   get:
 *     summary: Get all posts created by a user
 *     description: Retrieve all posts created by a specific user.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of posts created by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/filtered:
 *   post:
 *     summary: Filter posts based on query
 *     description: Filter posts based on search query and category.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search_query:
 *                 type: string
 *                 description: The query string for searching posts by title.
 *                 example: "JavaScript"
 *               category_id:
 *                 type: integer
 *                 description: The category ID to filter by.
 *                 example: 1
 *     responses:
 *       200:
 *         description: A list of filtered posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Operations related to posts
 *   - name: Authenticate
 *     description: Operations related to authentication
 */

/**
 * @swagger
 * /api/posts/like/{id}:
 *   post:
 *     summary: Like a post
 *     description: Like a post by its ID. The user must be authenticated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to like
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post liked successfully"
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request, already liked or some error
 */

/**
 * @swagger
 * /api/posts/unlike/{id}:
 *   post:
 *     summary: Unlike a post
 *     description: Remove like from a post by its ID. The user must be authenticated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to unlike
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request, not liked or some error
 */

/**
 * @swagger
 * /api/posts/dislike/{id}:
 *   post:
 *     summary: Dislike a post
 *     description: Dislike a post by its ID. The user must be authenticated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to dislike
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post disliked successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request, already disliked or some error
 */

/**
 * @swagger
 * /api/posts/undislike/{id}:
 *   post:
 *     summary: Undislike a post
 *     description: Remove dislike from a post by its ID. The user must be authenticated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to undislike
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post undisliked successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request, not disliked or some error
 */

/**
 * @swagger
 * /api/posts/save/{id}:
 *   post:
 *     summary: Save a post
 *     description: Save a post by its ID. The user must be authenticated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to save
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post saved successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request, already saved or some error
 */

/**
 * @swagger
 * /api/posts/unsave/{id}:
 *   post:
 *     summary: Unsave a post
 *     description: Remove a saved post by its ID. The user must be authenticated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to unsave
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post unsaved successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request, not saved or some error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "My First Post"
 *         description:
 *           type: string
 *           example: "This is a description of the post."
 *         content_link:
 *           type: string
 *           example: "http://example.com/content"
 *         user_id:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2022-01-01T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2022-01-01T00:00:00Z"
 */

module.exports = initRoutes;
