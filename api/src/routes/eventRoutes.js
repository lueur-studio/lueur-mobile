const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");
const eventService = require("../services/eventService");
const {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  joinEventValidation,
  updateAccessLevelValidation,
  removeUserValidation,
} = require("../middleware/validators/eventValidators");

router.post(
  "/",
  authenticate,
  createEventValidation,
  asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  })
);

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const events = await eventService.getUserEvents(req.user.id);
    res.status(200).json({
      success: true,
      data: events,
    });
  })
);

router.get(
  "/:id",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(
      parseInt(req.params.id),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: event,
    });
  })
);

router.put(
  "/:id",
  authenticate,
  updateEventValidation,
  asyncHandler(async (req, res) => {
    const event = await eventService.updateEvent(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  })
);

router.delete(
  "/:id",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    await eventService.deleteEvent(parseInt(req.params.id), req.user.id);
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  })
);

// TODO
router.post(
  "/join",
  authenticate,
  joinEventValidation,
  asyncHandler(async (req, res) => {
    const { invitationUrl } = req.body;
    const event = await eventService.joinEventByUrl(invitationUrl, req.user.id);
    res.status(200).json({
      success: true,
      message: "Successfully joined the event",
      data: event,
    });
  })
);

router.post(
  "/:id/leave",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    await eventService.leaveEvent(parseInt(req.params.id), req.user.id);
    res.status(200).json({
      success: true,
      message: "Successfully left the event",
    });
  })
);

router.get(
  "/:id/participants",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    const participants = await eventService.getEventParticipants(
      parseInt(req.params.id),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: participants,
    });
  })
);

router.put(
  "/:id/participants/:userId/access",
  authenticate,
  updateAccessLevelValidation,
  asyncHandler(async (req, res) => {
    const { accessLevel } = req.body;
    const access = await eventService.updateUserAccessLevel(
      parseInt(req.params.id),
      parseInt(req.params.userId),
      accessLevel,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Access level updated successfully",
      data: access,
    });
  })
);

router.delete(
  "/:id/participants/:userId",
  authenticate,
  removeUserValidation,
  asyncHandler(async (req, res) => {
    await eventService.removeUserFromEvent(
      parseInt(req.params.id),
      parseInt(req.params.userId),
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "User removed from event successfully",
    });
  })
);

router.post(
  "/:id/regenerate-url",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    const event = await eventService.generateNewInvitationUrl(
      parseInt(req.params.id),
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Invitation URL regenerated successfully",
      data: {
        invitation_url: event.invitation_url,
      },
    });
  })
);

module.exports = router;
