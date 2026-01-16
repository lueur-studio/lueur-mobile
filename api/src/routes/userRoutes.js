const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");
const userService = require("../services/userService");
const {
  updateProfileValidation,
} = require("../middleware/validators/userValidators");
const {
  changePasswordValidation,
} = require("../middleware/validators/passwordValidators");

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  })
);

router.put(
  "/me",
  authenticate,
  updateProfileValidation,
  asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  })
);

router.put(
  "/change-password",
  authenticate,
  changePasswordValidation,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, {
      currentPassword,
      newPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  })
);

router.delete(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    await userService.deleteProfile(req.user.id);
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  })
);

module.exports = router;
