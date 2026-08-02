const express = require("express");

const {
  createDetection,
  getLatestDetection,
  getTodayStatistics,
} = require("../controllers/detectionController");

const router = express.Router();

router.post("/detections", createDetection);

router.get("/detections", getLatestDetection);
router.get("/daily-statistics", getTodayStatistics);
module.exports = router;
