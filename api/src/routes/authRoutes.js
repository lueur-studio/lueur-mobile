const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");
const authService = require("../services/authService");
const {
  signupValidation,
  signinValidation,
} = require("../middleware/validators/authValidators");

router.post(
  "/signup",
  signupValidation,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await authService.signup({ name, email, password });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  })
);

router.post(
  "/signin",
  signinValidation,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.signin({ email, password });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  })
);

router.post(
  "/logout",
  authenticate,
  asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  })
);

module.exports = router;
