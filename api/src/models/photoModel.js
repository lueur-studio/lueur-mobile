const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Photo = sequelize.define(
  "Photo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
  },
  {
    tableName: "photos",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Photo;
