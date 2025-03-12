"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    cleanUser() {
      const { ...currentPost } = this.dataValues;
      return currentPost;
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
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_category",
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
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "dim_post",
    }
  );

  return Post;
};