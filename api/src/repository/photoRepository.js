const { Photo, User, Event, EventAccess } = require("../models");

const createPhoto = async (photoData) => {
  return await Photo.create(photoData);
};

const findById = async (photoId) => {
  return await Photo.findByPk(photoId, {
    include: [
      {
        model: User,
        as: "uploader",
        attributes: ["id", "name", "email"],
      },
      {
        model: Event,
        as: "event",
        attributes: ["id", "title"],
      },
    ],
  });
};

const findAllByEvent = async (eventId) => {
  return await Photo.findAll({
    where: { event_id: eventId },
    include: [
      {
        model: User,
        as: "uploader",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

const findAllByUser = async (userId) => {
  return await Photo.findAll({
    where: { added_by: userId },
    include: [
      {
        model: Event,
        as: "event",
        attributes: ["id", "title"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

const updatePhoto = async (photoId, updateData) => {
  const photo = await Photo.findByPk(photoId);

  if (!photo) {
    return null;
  }

  await photo.update(updateData);
  return await findById(photoId);
};

const deletePhoto = async (photoId) => {
  const photo = await Photo.findByPk(photoId);

  if (!photo) {
    return null;
  }

  await photo.destroy();
  return photo;
};

const countPhotosByEvent = async (eventId) => {
  return await Photo.count({
    where: { event_id: eventId },
  });
};

const findAllByUserEvents = async (userId) => {
  return await Photo.findAll({
    include: [
      {
        model: User,
        as: "uploader",
        attributes: ["id", "name", "email"],
      },
      {
        model: Event,
        as: "event",
        attributes: ["id", "title"],
        required: true,
        include: [
          {
            model: EventAccess,
            as: "eventAccess",
            where: { user_id: userId },
            attributes: [],
            required: true,
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

module.exports = {
  createPhoto,
  findById,
  findAllByEvent,
  findAllByUser,
  updatePhoto,
  deletePhoto,
  countPhotosByEvent,
  findAllByUserEvents,
};
