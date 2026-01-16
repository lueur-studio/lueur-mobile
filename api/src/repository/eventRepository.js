const { Event, EventAccess, User, Photo } = require("../models");
const { sequelize } = require("../config/database");
const { deleteFromS3 } = require("../utils/s3");

const createEvent = async (eventData, creatorId) => {
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.create(
      {
        ...eventData,
        creator_id: creatorId,
      },
      { transaction }
    );

    await EventAccess.create(
      {
        user_id: creatorId,
        event_id: event.id,
        access_level: 0, // admin
      },
      { transaction }
    );

    await transaction.commit();

    return await findById(event.id, creatorId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findById = async (eventId, userId = null) => {
  const includeOptions = [
    {
      model: User,
      as: "creator",
      attributes: ["id", "name", "email"],
    },
    {
      model: EventAccess,
      as: "eventAccess",
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    },
  ];

  const event = await Event.findByPk(eventId, {
    include: includeOptions,
  });

  if (!event) {
    return null;
  }

  // If userId is provided, include user's access level
  if (userId) {
    const userAccess = await EventAccess.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    event.dataValues.userAccessLevel = userAccess
      ? userAccess.access_level
      : null;
  }

  return event;
};

const findByInvitationUrl = async (invitationUrl) => {
  return await Event.findOne({
    where: { invitation_url: invitationUrl },
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

const findAllByUser = async (userId) => {
  return await Event.findAll({
    include: [
      {
        model: EventAccess,
        as: "eventAccess",
        where: { user_id: userId },
        required: true,
        attributes: ["access_level"],
      },
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["date", "DESC"]],
  });
};

const updateEvent = async (eventId, updateData) => {
  const event = await Event.findByPk(eventId);

  if (!event) {
    return null;
  }

  await event.update(updateData);
  return await findById(eventId);
};

const deleteEvent = async (eventId) => {
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      await transaction.rollback();
      return false;
    }

    const photos = await Photo.findAll({
      where: { event_id: eventId },
      attributes: ["id", "image_url"],
    });

    for (const photo of photos) {
      try {
        await deleteFromS3(photo.image_url);
      } catch (error) {
        console.error(`Failed to delete photo ${photo.id} from S3:`, error);
      }
    }

    await Photo.destroy({
      where: { event_id: eventId },
      transaction,
    });

    await EventAccess.destroy({
      where: { event_id: eventId },
      transaction,
    });

    await event.destroy({ transaction });

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Event Access methods
const addUserToEvent = async (eventId, userId, accessLevel = 2) => {
  const existingAccess = await EventAccess.findOne({
    where: { event_id: eventId, user_id: userId },
  });

  if (existingAccess) {
    return existingAccess;
  }

  return await EventAccess.create({
    event_id: eventId,
    user_id: userId,
    access_level: accessLevel,
  });
};

const updateUserAccess = async (eventId, userId, accessLevel) => {
  const access = await EventAccess.findOne({
    where: { event_id: eventId, user_id: userId },
  });

  if (!access) {
    return null;
  }

  await access.update({ access_level: accessLevel });
  return access;
};

const removeUserFromEvent = async (eventId, userId) => {
  const access = await EventAccess.findOne({
    where: { event_id: eventId, user_id: userId },
  });

  if (!access) {
    return false;
  }

  await access.destroy();
  return true;
};

const getUserAccessLevel = async (eventId, userId) => {
  const access = await EventAccess.findOne({
    where: { event_id: eventId, user_id: userId },
    attributes: ["access_level"],
  });

  return access ? access.access_level : null;
};

const getEventParticipants = async (eventId) => {
  return await EventAccess.findAll({
    where: { event_id: eventId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["access_level", "ASC"]],
  });
};

module.exports = {
  createEvent,
  findById,
  findByInvitationUrl,
  findAllByUser,
  updateEvent,
  deleteEvent,
  addUserToEvent,
  updateUserAccess,
  removeUserFromEvent,
  getUserAccessLevel,
  getEventParticipants,
};
