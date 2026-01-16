const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");
const photoService = require("../services/photoService");
const {
  uploadPhotoValidation,
  photoIdValidation,
  eventIdValidation,
} = require("../middleware/validators/photoValidators");

router.post(
  "/",
  authenticate,
  upload.single("photo"),
  uploadPhotoValidation,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No photo file provided",
      });
    }

    const { eventId } = req.body;
    const photo = await photoService.uploadPhoto(
      req.file,
      parseInt(eventId),
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Photo uploaded successfully",
      data: photo,
    });
  })
);

router.get(
  "/my-photos",
  authenticate,
  asyncHandler(async (req, res) => {
    const photos = await photoService.getUserPhotos(req.user.id);
    res.status(200).json({
      success: true,
      data: photos,
    });
  })
);

router.get(
  "/my-events-photos",
  authenticate,
  asyncHandler(async (req, res) => {
    const photos = await photoService.getAllPhotosFromUserEvents(req.user.id);
    res.status(200).json({
      success: true,
      data: photos,
    });
  })
);

router.get(
  "/event/:eventId",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    const photos = await photoService.getPhotosByEvent(
      parseInt(req.params.eventId),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: photos,
    });
  })
);

router.get(
  "/event/:eventId/count",
  authenticate,
  eventIdValidation,
  asyncHandler(async (req, res) => {
    const count = await photoService.getEventPhotoCount(
      parseInt(req.params.eventId),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: { count },
    });
  })
);

router.get(
  "/:id",
  authenticate,
  photoIdValidation,
  asyncHandler(async (req, res) => {
    const photo = await photoService.getPhotoById(
      parseInt(req.params.id),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: photo,
    });
  })
);

router.delete(
  "/:id",
  authenticate,
  photoIdValidation,
  asyncHandler(async (req, res) => {
    await photoService.deletePhoto(parseInt(req.params.id), req.user.id);
    res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });
  })
);

module.exports = router;
