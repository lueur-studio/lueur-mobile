const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const crypto = require("crypto");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    invitation_url: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "events",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (event) => {
        // Generate unique invitation URL if not provided
        if (!event.invitation_url) {
          event.invitation_url = crypto.randomBytes(16).toString("hex");
        }
      },
    },
  }
);

module.exports = Event;
