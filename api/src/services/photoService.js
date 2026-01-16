const photoRepository = require("../repository/photoRepository");
const eventRepository = require("../repository/eventRepository");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

const uploadPhoto = async (file, eventId, userId) => {
  const accessLevel = await eventRepository.getUserAccessLevel(eventId, userId);

  if (accessLevel === null) {
    throw new Error("You do not have access to this event");
  }

  if (accessLevel === 2) {
    throw new Error("Only contributors and admins can upload photos");
  }

  const imageUrl = await uploadToS3(
    file.buffer,
    file.mimetype,
    file.originalname
  );

  const photo = await photoRepository.createPhoto({
    image_url: imageUrl,
    added_by: userId,
    event_id: eventId,
  });

  return await photoRepository.findById(photo.id);
};

const getPhotoById = async (photoId, userId) => {
  const photo = await photoRepository.findById(photoId);

  if (!photo) {
    throw new Error("Photo not found");
  }

  const accessLevel = await eventRepository.getUserAccessLevel(
    photo.event_id,
    userId
  );

  if (accessLevel === null) {
    throw new Error("You do not have access to this photo");
  }

  return photo;
};

const getPhotosByEvent = async (eventId, userId) => {
  const accessLevel = await eventRepository.getUserAccessLevel(eventId, userId);

  if (accessLevel === null) {
    throw new Error("You do not have access to this event");
  }

  return await photoRepository.findAllByEvent(eventId);
};

const getUserPhotos = async (userId) => {
  return await photoRepository.findAllByUser(userId);
};

const getAllPhotosFromUserEvents = async (userId) => {
  return await photoRepository.findAllByUserEvents(userId);
};

const deletePhoto = async (photoId, userId) => {
  const photo = await photoRepository.findById(photoId);

  if (!photo) {
    throw new Error("Photo not found");
  }

  const accessLevel = await eventRepository.getUserAccessLevel(
    photo.event_id,
    userId
  );

  if (accessLevel === null) {
    throw new Error("You do not have access to this photo");
  }

  if (photo.added_by !== userId && accessLevel !== 0) {
    throw new Error(
      "Only the photo uploader or event admin can delete the photo"
    );
  }

  await deleteFromS3(photo.image_url);

  await photoRepository.deletePhoto(photoId);

  return true;
};

const getEventPhotoCount = async (eventId, userId) => {
  const accessLevel = await eventRepository.getUserAccessLevel(eventId, userId);

  if (accessLevel === null) {
    throw new Error("You do not have access to this event");
  }

  return await photoRepository.countPhotosByEvent(eventId);
};

module.exports = {
  uploadPhoto,
  getPhotoById,
  getPhotosByEvent,
  getUserPhotos,
  getAllPhotosFromUserEvents,
  deletePhoto,
  getEventPhotoCount,
};
