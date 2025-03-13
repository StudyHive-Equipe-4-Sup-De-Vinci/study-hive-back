"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "owner_id",
        as: "user",
      });
      Post.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
      Post.hasMany(models.UserAction, {
        foreignKey: "post_id",
        as: "likes",
      });
      Post.hasMany(models.UserAction, {
        foreignKey: "post_id",
        as: "dislikes",
      });
      Post.hasMany(models.UserAction, {
        foreignKey: "post_id",
        as: "favs",
      });
      Post.hasMany(models.Comment, {
        foreignKey: "post_id",
        as: "comments",
      });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_post",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "title",
      },
      content_link: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "content_link",
      },
			description: {
        type: DataTypes.STRING,
        allowNull: true,
				defaultValue: null,
			},
			owner_id: {
				type: DataTypes.STRING,
				allowNull: false,
				field: "id_user",
			},
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_category",
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "dim_post",
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Post;
};