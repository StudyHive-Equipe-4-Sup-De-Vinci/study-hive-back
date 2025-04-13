const { Op } = require("sequelize");
const { Category, Post, UserAction, User, sequelize } = require("../models");
const { uploadFileToS3 } = require("./aws");

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

    var { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["created_at", "DESC"]],
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

    await rows.map(async (element) => {
      const likes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 1,
        },
      });
      const dislikes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 2,
        },
      });
      element.dataValues.grade = likes.length - dislikes.length;
      return element;
    });
    setTimeout(() => {
      res.status(200).json({
        message: "Posts retrieved successfully",
        Posts: rows,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        pageSize: pageSize,
      });
    }, 100);
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
async function createPost(req, res) {
  const transaction = await sequelize.transaction();
  console.log("début ?");
  try {
    const { title, description, category_id } = req.body;
    const user_id = req.user.id;

    if (!req.files.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }
    const file = req.files.file;
    const fileUrl = await uploadFileToS3(file.data, file.name, file.mimetype);

    const new_post = await Post.create(
      {
        title,
        description,
        content_link: fileUrl,
        user_id,
        category_id,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).send({
      message: "Post created successfully",
      post: new_post,
    });
  } catch (err) {
    await transaction.rollback();
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

    const likes = await UserAction.findAll({
      where: {
        post_id: post.id,
        action_id: 1,
      },
    });
    const dislikes = await UserAction.findAll({
      where: {
        post_id: post.id,
        action_id: 2,
      },
    });
    post.dataValues.grade = likes.length - dislikes.length;

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

async function getFavoritePostsOfUser(req, res, next) {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const userActions = await UserAction.findAll({
      where: {
        user_id,
        action_id: 3,
      },
      attributes: ["post_id"],
    });

    const post_ids = userActions.map((post) => post.post_id);
    const { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      where: {
        id: post_ids,
      },
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

    await rows.map(async (element) => {
      const likes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 1,
        },
      });
      const dislikes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 2,
        },
      });
      element.dataValues.grade = likes.length - dislikes.length;
      return element;
    });

    setTimeout(() => {
      res.status(200).json({
        message: "Posts retrieved successfully",
        Posts: rows,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        pageSize: pageSize,
      });
    }, 100);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getPostsCreatedByUser(req, res, next) {
  try {
    const user_id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      where: {
        user_id,
      },
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

    await rows.map(async (element) => {
      const likes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 1,
        },
      });
      const dislikes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 2,
        },
      });
      element.dataValues.grade = likes.length - dislikes.length;
      return element;
    });

    setTimeout(() => {
      res.status(200).json({
        message: "Posts retrieved successfully",
        Posts: rows,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        pageSize: pageSize,
      });
    }, 100);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getPostsByCategory(req, res, next) {
  try {
    const categoryId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      where: {
        category_id: categoryId,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    await rows.map(async (element) => {
      const likes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 1,
        },
      });
      const dislikes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 2,
        },
      });
      element.dataValues.grade = likes.length - dislikes.length;
      return element;
    });

    setTimeout(() => {
      res.status(200).json({
        message: "Posts retrieved successfully",
        Posts: rows,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        pageSize: pageSize,
      });
    }, 100);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getPostsFiltered(req, res, next) {
  try {
    const { search_query, category_id } = req.body;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const whereConditions = {};
    if (
      category_id !== undefined &&
      category_id !== null &&
      !isNaN(category_id)
    ) {
      whereConditions.category_id = category_id;
    }

    if (search_query && search_query !== "") {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search_query.toLowerCase()}%` } },
        { description: { [Op.like]: `%${search_query.toLowerCase()}%` } },
      ];
    }

    const { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["created_at", "DESC"]],
      where: whereConditions,
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

    await rows.map(async (element) => {
      const likes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 1,
        },
      });
      const dislikes = await UserAction.findAll({
        where: {
          post_id: element.id,
          action_id: 2,
        },
      });
      element.dataValues.grade = likes.length - dislikes.length;
      return element;
    });

    setTimeout(() => {
      res.status(200).json({
        message: "Posts retrieved successfully",
        Posts: rows,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        pageSize: pageSize,
      });
    }, 100);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message || error,
    });
  }
}

async function likePost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    var like = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 1,
      },
    });
    if (like) {
      return res.status(200).json({
        message: "You already liked this post",
      });
    }
    like = await UserAction.create({
      user_id: userId,
      post_id: postId,
      action_id: 1,
      date: new Date(),
    });
    const dislike = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 2,
      },
    });
    if (dislike) {
      dislike.destroy();
    }
    const likes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 1,
      },
    });
    const dislikes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 2,
      },
    });
    res.status(200).json({
      message: "Post liked successfully",
      grade: likes.length - dislikes.length,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function unlikePost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    var like = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 1,
      },
    });
    if (!like) {
      return res.status(200).json({
        message: "You are currently not liking this post",
      });
    }
    like.destroy();
    const likes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 1,
      },
    });
    const dislikes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 2,
      },
    });
    res.status(200).json({
      message: "Post unliked successfully",
      grade: likes.length - dislikes.length,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function dislikePost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    var dislike = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 2,
      },
    });
    if (dislike) {
      return res.status(200).json({
        message: "You already disliked this post",
      });
    }
    dislike = await UserAction.create({
      user_id: userId,
      post_id: postId,
      action_id: 2,
      date: new Date(),
    });
    const like = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 1,
      },
    });
    if (like) {
      like.destroy();
    }
    const likes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 1,
      },
    });
    const dislikes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 2,
      },
    });
    res.status(200).json({
      message: "Post disliked successfully",
      grade: likes.length - dislikes.length,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function undislikePost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    var dislike = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 2,
      },
    });
    if (!dislike) {
      return res.status(200).json({
        message: "You are currently not disliking this post",
      });
    }
    dislike.destroy();
    const likes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 1,
      },
    });
    const dislikes = await UserAction.findAll({
      where: {
        user_id: userId,
        action_id: 2,
      },
    });
    res.status(200).json({
      message: "Post undisliked successfully",
      grade: likes.length - dislikes.length,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function savePost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    var save = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 3,
      },
    });
    if (save) {
      return res.status(200).json({
        message: "You already saved this post",
      });
    }
    save = await UserAction.create({
      user_id: userId,
      post_id: postId,
      action_id: 3,
      date: new Date(),
    });
    res.status(200).json({
      message: "Post saved successfully",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function unsavePost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    var save = await UserAction.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        action_id: 3,
      },
    });
    if (!save) {
      return res.status(200).json({
        message: "You have not saved this post",
      });
    }
    save.destroy();
    res.status(200).json({
      message: "Post unsaved successfully",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

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
