"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Action.hasMany(models.UserAction, {
        foreignKey: "action_id",
        as: "user_actions",
      });
    }
  }

  Action.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_action",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Action",
      tableName: "action",
      timestamps: false,
    }
  );

  return Action;
};
