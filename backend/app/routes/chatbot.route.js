const express = require("express");
const chatbot = require("../controllers/chatbot_controller/chatbot.controller");

const router = express.Router();

router.post("/", chatbot.handleChat);
router.post("/sync", chatbot.syncData);

module.exports = router;
