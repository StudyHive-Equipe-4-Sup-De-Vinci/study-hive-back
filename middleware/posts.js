const { checkSchema } = require("express-validator");
const { Post, User } = require("../models");
const jwt = require("jsonwebtoken");

/**
 * Validates the request for creating a new post. 
 * It checks that the title, description, content_link and category_id are properly provided and formatted.
*/
async function validateCreatePost(req, res, next) {
  const [error] = await checkSchema({
    title: {
      optional: false,
      notEmpty: true,
      isString: true,
    },
    description: {
      optional: false,
      notEmpty: true,
      isString: true,
    },
    content_link: {
      optional: false,
      notEmpty: true,
      isString: true,
    },
    category_id: {
      optional: false,
      notEmpty: true,
      isInt: true,
    },
  }).run(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
}

/**
 * Validates the request for updating an post. 
 * Ensures that title, description, price, status, and category_id are provided and properly formatted.
*/
async function validateUpdatePost(req, res, next) {
  const [error] = await checkSchema({
    title: {
      optional: false,
      notEmpty: true,
      isString: true,
    },
    description: {
      optional: false,
      notEmpty: true,
      isString: true,
    },
    content_link: {
      optional: false,
      notEmpty: true,
      isString: true,
    },
    category_id: {
      optional: false,
      notEmpty: true,
      isInt: true,
    },
	}).run(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
}

/** 
 * Checks if the authenticated user is the owner of the post being modified.
 * Verifies the JWT token and ensures that the user's email matches the owner of the post.
*/
async function checkIsPostOwner(req, res, next) {
  const token = req.headers["authorization"];

  jwt.verify(token, "secret-key", async (err, decoded) => {
    const authenticatedUserId = decoded.user.id;
    const post_id = req.params.id;
    const post = await Post.findByPk(post_id);
    if (post === null) {
      return res.status(404).json({ error: `Post does not exist` });
    }

    if (authenticatedUserId != post.user_id) {
      return res.status(401).json({
        error: `You don't have the rights to do this.`,
      });
    }
    next();
  });
}

/** 
 * Checks if the authenticated user is the owner or an admin.
 * Verifies that the user either owns the post or has admin rights.
*/
async function checkIsPostOwnerOrAdmin(req, res, next) {
  const token = req.headers["authorization"];
  const post_id = req.params.id;

  jwt.verify(token, "secret-key", async (err, decoded) => {
    const userId = decoded.user.id;
    const user = await User.findByPk(userId);
    const post = await Post.findByPk(post_id);
    if (!user || (user.id != post.user_id && !user.is_admin)) {
      return res
        .status(401)
        .send({ message: "You don't have the rights to do that" });
    }
    next();
  });
}

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  checkIsPostOwner,
  checkIsPostOwnerOrAdmin,
};
