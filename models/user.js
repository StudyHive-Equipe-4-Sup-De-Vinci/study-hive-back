"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "user_id",
        as: "posts",
      });
    }

    cleanUser() {
      const { password, access_token, ...currentUser } = this.dataValues;
      return currentUser;
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_user",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "pseudo",
      },
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "dt_inscription",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "mail",
      },
      access_token: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      profile_picture_link: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "dim_user",
      timestamps: false,
    }
  );

  return User;
};
