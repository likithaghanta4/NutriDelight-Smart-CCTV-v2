const express = require("express");

const healthRoutes = require("./healthRoutes");
const detectionRoutes = require("./detectionRoutes");
const visitorAnalyticsRoutes = require("./visitorAnalyticsRoutes");
const vehicleAnalyticsRoutes = require("./vehicleAnalyticsRoutes");
const ownerRoutes = require("./ownerRoutes");
const router = express.Router();

router.use(healthRoutes);
router.use(detectionRoutes);
router.use(visitorAnalyticsRoutes);
router.use(vehicleAnalyticsRoutes);
router.use(ownerRoutes);

module.exports = router;
