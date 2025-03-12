"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    cleanUser() {
      const { password, token, ...currentUser } = this.dataValues;
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "mail",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "dt_inscription",
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