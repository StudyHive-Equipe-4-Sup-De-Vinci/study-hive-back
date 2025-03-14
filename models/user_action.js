"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserAction.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      UserAction.belongsTo(models.Post, {
        foreignKey: "post_id",
      });
      UserAction.belongsTo(models.Action, {
        foreignKey: "action_id",
        as: "action",
      });
    }
  }

  UserAction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_user_action",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      action_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_action",
      },
      user_id: {
        type: DataTypes.INTEGER,
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
      modelName: "UserAction",
      tableName: "user_action",
      timestamps: false,
    }
  );

  return UserAction;
};
