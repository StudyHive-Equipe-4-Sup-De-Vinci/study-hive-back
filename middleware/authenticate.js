const { checkSchema } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Middleware to validate login request body.
 * It checks that email and password are provided and valid.
 */
async function validateLogin(req, res, next) {
  const [error] = await checkSchema({
    username: { notEmpty: true },
    password: { notEmpty: true },
  }).run(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
}


/**
 * Middleware to check if user is authenticated by verifying the JWT token.
 * The token is expected to be provided in the Authorization header.
 */
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send({ message: "No token provided" });

  jwt.verify(token, "secret-key", async (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token" });
    }
    const user = await User.findByPk(decoded.user.id);

		const right_token = await bcrypt.compare(token, user.access_token);

		if (!right_token) {
      return res.status(403).send({ message: "Session expired" });
    }

    req.user = user;

    next();
  });
}

module.exports = {
  validateLogin,
	authMiddleware,
};
