const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);

// Google OAuth
router.get("/google-login", auth.googleLogin); // Redirect to Google
router.post("/google-callback", auth.googleCallback); // Process code from frontend

module.exports = router;
