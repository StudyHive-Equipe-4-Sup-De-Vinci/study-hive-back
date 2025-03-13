const { checkSchema } = require("express-validator");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Middleware to validate user registration request body.
 * It checks that required fields such as name, email, and password are provided and valid.
 */
async function validateRegister(req, res, next) {
  const [error] = await checkSchema({
    name: { notEmpty: true },
    email: { notEmpty: true, isEmail: true },
    password: { notEmpty: true },
  }).run(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
}

module.exports = {
  validateRegister,
};
