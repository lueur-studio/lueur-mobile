const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const EventAccess = sequelize.define(
  "EventAccess",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
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
    access_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: {
        isIn: [[0, 1, 2]], // 0: admin, 1: contributor, 2: viewer
      },
      comment: "0: admin, 1: contributor, 2: viewer",
    },
  },
  {
    tableName: "event_access",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "event_id"],
      },
    ],
  }
);

module.exports = EventAccess;
