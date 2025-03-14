const express = require("express");
const router = express.Router();
const { sequelize } = require("../models");
const { login, logout, register } = require("../services/authenticate");
const {
  validateLogin,
  authMiddleware,
  validateRegister,
} = require("../middleware/authenticate");

// DB Connection Health check
router.get("/health_check", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send({ connected_to_db: true });
  } catch (error) {
    res.status(500).send({
      connected_to_db: false,
      error: error.message || error,
    });
  }
});

// Protected Route (Test Authentication)
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).send({ authenticated: true });
});

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Login
 *    description: Login a user and return a JWT token.
 *    tags:
 *      - Authenticate
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: The username of the user, or their email.
 *                example: user1
 *              password:
 *                type: string
 *                description: The password of the user.
 *                example: password
 *    responses:
 *      200:
 *        description: User logged in successfully and token returned.
 *      400:
 *        description: Invalid credentials.
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /logout:
 *  get:
 *    summary: Logout
 *    description: Logout the authenticated user and invalidate the token.
 *    tags:
 *      - Authenticate
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User logged out successfully.
 *      400:
 *        description: Something went wrong.
 */
router.get("/logout", authMiddleware, logout);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     description: Create a new user account.
 *     tags:
 *       - Authenticate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: user1
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       409:
 *         description: Username or email already exists.
 *       400:
 *         description: Something went wrong.
 */
router.post("/register", validateRegister, register);

module.exports = router;
