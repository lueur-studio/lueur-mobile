const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const photoRoutes = require("./photoRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/photos", photoRoutes);

module.exports = router;
