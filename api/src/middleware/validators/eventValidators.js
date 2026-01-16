const { body, param } = require("express-validator");

const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid date format. Use ISO 8601 format"),
];

const updateEventValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid event ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format. Use ISO 8601 format"),
];

const eventIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid event ID"),
];

const joinEventValidation = [
  body("invitationUrl")
    .trim()
    .notEmpty()
    .withMessage("Invitation URL is required")
    .isLength({ min: 32, max: 32 })
    .withMessage("Invalid invitation URL format"),
];

const updateAccessLevelValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid event ID"),

  param("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),

  body("accessLevel")
    .notEmpty()
    .withMessage("Access level is required")
    .isInt({ min: 0, max: 2 })
    .withMessage(
      "Access level must be 0 (admin), 1 (contributor), or 2 (viewer)"
    ),
];

const removeUserValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid event ID"),

  param("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  joinEventValidation,
  updateAccessLevelValidation,
  removeUserValidation,
};
