const { Post, User, Category, sequelize } = require("../models");

/**
 * Method to retrieve all posts, take pagination into account.
 * @param {Request} req - You can include in the body the page number et pageSize (default is 1 and 10 respectively).
 * 
 */
async function getAllPosts(req, res, next) {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const rows = await Post.findAll({
      limit: pageSize,
      offset: offset,
    }, {
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.status(200).json({
      message: "Posts retrieved successfully",
      Posts: rows,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

/**
 * Not written yet
 * Method to save a pdf in the server, and returns the url.
 * You need to specify the file.
 * 
 */
function uploadPdf(req, res, next) {}

/**
 * Method to create a post. You need to be authenticated to create a post.
 * @param {Request} req - You need to specify in the body, the title, description, content_link and category_id. The user_id is deduced from the token.
 * 
 */
async function createPost(req, res, next) {
	const transaction = await sequelize.transaction();
  try {
    const { title, description, content_link, category_id } = req.body;
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, "secret-key");
    const user_id = decoded.user.id;
    const new_post = await Post.create(
      {
        title,
        description,
        content_link,
        user_id,
        category_id,
      },
      { transaction }
    );
    transaction.commit();
    res.status(201).send({
      message: `Post created successfully`,
      post: new_post,
    });
  } catch (err) {
    transaction.rollback();
    res.status(400).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
}

/**
 * Method to retrieve a post.
 * @param {Request} req -  You need to specify the id of the post in the params.
 */
async function getPost(req, res, next) {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });
    if (!post) {
      return res.status(404).json({
        message: `Post ${id} not found`,
      });
    }
    res.status(200).json({
      message: "Post retrieved successfully",
      post,
    });
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
}

/**
 * Method to update a post. You can update the description, the title, the content_link or the category_id.
 * @param {Request} req - You need to specify in the body, the title, description, content_link and category_id. The post_id must be given in the url params.
 * 
 */
async function updatePost(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { title, description, content_link, category_id } = req.body;
    const post_id = req.params.id;

    const post = await Post.findByPk(post_id, {
      transaction,
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await post.update(
      {
        title,
        description,
        content_link,
        category_id,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).send({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    res.status(400).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
}

/**
 * Method to delete a post. You can update the description, the title, the content_link or the category_id.
 * @param {Request} req - You need to specify the post_id in the params.
 * 
 */
async function deletePost(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const post_id = req.params.id;
    const destroy = await Post.destroy(
      {
        where: { id: post_id },
      },
      { transaction }
    );

    transaction.commit();
    res.status(200).send({
      message: "Post deleted successfully",
    });
  } catch (err) {
    await transaction.rollback();
    res.status(400).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
}

function getFavoritePostsOfUser(req, res, next) {}

function getPostsCreatedByUser(req, res, next) {}

function getPostsByCategory(req, res, next) {}

function getPostsFiltered(req, res, next) {}

function likePost(req, res, next) {}

function unlikePost(req, res, next) {}

function dislikePost(req, res, next) {}

function undislikePost(req, res, next) {}

function savePost(req, res, next) {}

function unsavePost(req, res, next) {}

function commentOnPost(req, res, next) {}

module.exports = {
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
};
