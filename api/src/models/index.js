const { sequelize } = require("../config/database");
const User = require("./userModel");
const UserAuth = require("./userAuthModel");
const Event = require("./eventModel");
const EventAccess = require("./eventAccessModel");
const Photo = require("./photoModel");

const db = {
  sequelize,
  User,
  UserAuth,
  Event,
  EventAccess,
  Photo,
};

// User - UserAuth (one-to-one)
User.hasOne(UserAuth, {
  foreignKey: "user_id",
  as: "auth",
  onDelete: "CASCADE",
});
UserAuth.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User - Event (one-to-many as creator)
User.hasMany(Event, {
  foreignKey: "creator_id",
  as: "createdEvents",
  onDelete: "CASCADE",
});
Event.belongsTo(User, {
  foreignKey: "creator_id",
  as: "creator",
});

// User - Event (many-to-many through EventAccess)
User.belongsToMany(Event, {
  through: EventAccess,
  foreignKey: "user_id",
  otherKey: "event_id",
  as: "events",
});
Event.belongsToMany(User, {
  through: EventAccess,
  foreignKey: "event_id",
  otherKey: "user_id",
  as: "participants",
});

// EventAccess relationships
EventAccess.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
EventAccess.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});
User.hasMany(EventAccess, {
  foreignKey: "user_id",
  as: "eventAccess",
  onDelete: "CASCADE",
});
Event.hasMany(EventAccess, {
  foreignKey: "event_id",
  as: "eventAccess",
  onDelete: "CASCADE",
});

// Event - Photo (one-to-many)
Event.hasMany(Photo, {
  foreignKey: "event_id",
  as: "photos",
  onDelete: "CASCADE",
});
Photo.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

// User - Photo (one-to-many)
User.hasMany(Photo, {
  foreignKey: "added_by",
  as: "photos",
  onDelete: "CASCADE",
});
Photo.belongsTo(User, {
  foreignKey: "added_by",
  as: "uploader",
});

module.exports = db;
