"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Fiche extends Model {
    cleanUser() {
      const { ...currentFiche } = this.dataValues;
      return currentFiche;
    }
  }

  Fiche.init(
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
      modelName: "Fiche",
      tableName: "dim_post",
    }
  );

  return User;
};