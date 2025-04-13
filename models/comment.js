"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_comment",
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "id_user",
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_post",
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "user_comment",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Comment;
};
