const express = require("express");
const websiteInfo = require("../controllers/websiteinfo.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Get website info (admin only)
router.get("/", auth, isAdmin, websiteInfo.get);

// Update website info (admin only)
router.put("/", auth, isAdmin, websiteInfo.update);

module.exports = router;
