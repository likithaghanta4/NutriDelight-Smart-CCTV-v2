const express = require("express");

const { streamLiveCamera } = require("../controllers/ownerStreamController");
const requireOwnerAuth = require("../middleware/requireOwnerAuth");

const router = express.Router();

router.get("/owner/live-stream", requireOwnerAuth, streamLiveCamera);

module.exports = router;
