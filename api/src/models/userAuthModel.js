const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const UserAuth = sequelize.define(
  "UserAuth",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "user_auth",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (userAuth) => {
        if (
          userAuth.password_hash &&
          !userAuth.password_hash.startsWith("$2") // Check if already hashed
        ) {
          const salt = await bcrypt.genSalt(10); // Add salt rounds to improve security
          userAuth.password_hash = await bcrypt.hash(
            userAuth.password_hash,
            salt
          );
        }
      },
      beforeUpdate: async (userAuth) => {
        if (
          userAuth.changed("password_hash") &&
          !userAuth.password_hash.startsWith("$2")
        ) {
          const salt = await bcrypt.genSalt(10);
          userAuth.password_hash = await bcrypt.hash(
            userAuth.password_hash,
            salt
          );
        }
      },
    },
  }
);

UserAuth.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = UserAuth;
