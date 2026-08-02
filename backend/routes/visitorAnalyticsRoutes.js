const express = require("express");
const {
  getVisitorAnalytics,
} = require("../controllers/visitorAnalyticsController");

const router = express.Router();

router.get("/visitor-analytics", getVisitorAnalytics);

module.exports = router;
