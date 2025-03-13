"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Post, {
        foreignKey: "category_id",
        as: "posts",
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_category",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "category_name",
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "category",
			timestamps: false,
    }
  );

  return Category;
};
