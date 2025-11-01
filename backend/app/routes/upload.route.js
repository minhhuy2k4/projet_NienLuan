const express = require("express");
const uploadController = require("../controllers/upload.controller");
const { uploadAudio } = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Áp dụng middleware xác thực (chỉ admin được upload)
router.use(authMiddleware);

// Upload audio
router.post(
  "/audio",
  uploadAudio.single("audioFile"),
  uploadController.uploadAudioFile
);

module.exports = router;
