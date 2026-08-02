const express = require("express");
const {
  getVehicleAnalytics,
  getHourlyVehicleAnalytics,
} = require("../controllers/vehicleAnalyticsController");

const router = express.Router();

router.get("/vehicle-analytics", getVehicleAnalytics);
router.get("/vehicle-analytics/hourly", getHourlyVehicleAnalytics);

module.exports = router;
