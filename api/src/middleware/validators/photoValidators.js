const { body, param } = require("express-validator");

const uploadPhotoValidation = [
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isInt({ min: 1 })
    .withMessage("Invalid event ID"),
];

const photoIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid photo ID"),
];

const eventIdValidation = [
  param("eventId").isInt({ min: 1 }).withMessage("Invalid event ID"),
];

module.exports = {
  uploadPhotoValidation,
  photoIdValidation,
  eventIdValidation,
};
