const eventRepository = require("../repository/eventRepository");

const createEvent = async (eventData, creatorId) => {
  // Confirm event date is not in the past
  const eventDate = new Date(eventData.date);
  if (eventDate < new Date()) {
    throw new Error("Event date cannot be in the past");
  }

  return await eventRepository.createEvent(eventData, creatorId);
};

const getUserEvents = async (userId) => {
  return await eventRepository.findAllByUser(userId);
};

const getEventById = async (eventId, userId) => {
  const event = await eventRepository.findById(eventId, userId);

  if (!event) {
    throw new Error("Event not found");
  }

  const userAccessLevel = await eventRepository.getUserAccessLevel(
    eventId,
    userId
  );

  if (userAccessLevel === null) {
    throw new Error("You do not have access to this event");
  }

  return event;
};

const updateEvent = async (eventId, updateData, userId) => {
  const accessLevel = await eventRepository.getUserAccessLevel(eventId, userId);

  if (accessLevel === null) {
    throw new Error("Event not found or you do not have access");
  }

  if (accessLevel !== 0) {
    throw new Error("Only admins can update event details");
  }

  if (updateData.date) {
    const eventDate = new Date(updateData.date);
    if (eventDate < new Date()) {
      throw new Error("Event date cannot be in the past");
    }
  }

  const updatedEvent = await eventRepository.updateEvent(eventId, updateData);

  if (!updatedEvent) {
    throw new Error("Event not found");
  }

  return updatedEvent;
};

const deleteEvent = async (eventId, userId) => {
  const event = await eventRepository.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.creator_id !== userId) {
    throw new Error("Only the event creator can delete the event");
  }

  const deleted = await eventRepository.deleteEvent(eventId);

  if (!deleted) {
    throw new Error("Failed to delete event");
  }

  return true;
};

const joinEventByUrl = async (invitationUrl, userId) => {
  const event = await eventRepository.findByInvitationUrl(invitationUrl);

  if (!event) {
    throw new Error("Invalid invitation URL");
  }

  const existingAccess = await eventRepository.getUserAccessLevel(
    event.id,
    userId
  );

  if (existingAccess !== null) {
    return await eventRepository.findById(event.id, userId);
  }

  await eventRepository.addUserToEvent(event.id, userId, 1);

  return await eventRepository.findById(event.id, userId);
};

const leaveEvent = async (eventId, userId) => {
  const event = await eventRepository.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.creator_id === userId) {
    throw new Error(
      "Event creator cannot leave the event. Please delete the event instead."
    );
  }

  const removed = await eventRepository.removeUserFromEvent(eventId, userId);

  if (!removed) {
    throw new Error("You are not part of this event");
  }

  return true;
};

const getEventParticipants = async (eventId, userId) => {
  const accessLevel = await eventRepository.getUserAccessLevel(eventId, userId);

  if (accessLevel === null) {
    throw new Error("You do not have access to this event");
  }

  return await eventRepository.getEventParticipants(eventId);
};

const updateUserAccessLevel = async (
  eventId,
  targetUserId,
  accessLevel,
  requesterId
) => {
  const requesterAccess = await eventRepository.getUserAccessLevel(
    eventId,
    requesterId
  );

  if (requesterAccess !== 0) {
    throw new Error("Only admins can update user access levels");
  }

  const event = await eventRepository.findById(eventId);
  if (event.creator_id === targetUserId) {
    throw new Error("Cannot change access level of the event creator");
  }

  const updated = await eventRepository.updateUserAccess(
    eventId,
    targetUserId,
    accessLevel
  );

  if (!updated) {
    throw new Error("User access not found");
  }

  return updated;
};

const removeUserFromEvent = async (eventId, targetUserId, requesterId) => {
  const requesterAccess = await eventRepository.getUserAccessLevel(
    eventId,
    requesterId
  );

  if (requesterAccess !== 0) {
    throw new Error("Only admins can remove users from events");
  }

  const event = await eventRepository.findById(eventId);
  if (event.creator_id === targetUserId) {
    throw new Error("Cannot remove the event creator");
  }

  const removed = await eventRepository.removeUserFromEvent(
    eventId,
    targetUserId
  );

  if (!removed) {
    throw new Error("User not found in event");
  }

  return true;
};

const generateNewInvitationUrl = async (eventId, userId) => {
  const accessLevel = await eventRepository.getUserAccessLevel(eventId, userId);

  if (accessLevel !== 0) {
    throw new Error("Only admins can regenerate invitation URLs");
  }

  const crypto = require("crypto");
  const newInvitationUrl = crypto.randomBytes(16).toString("hex");

  const updatedEvent = await eventRepository.updateEvent(eventId, {
    invitation_url: newInvitationUrl,
  });

  return updatedEvent;
};

module.exports = {
  createEvent,
  getUserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEventByUrl,
  leaveEvent,
  getEventParticipants,
  updateUserAccessLevel,
  removeUserFromEvent,
  generateNewInvitationUrl,
};
