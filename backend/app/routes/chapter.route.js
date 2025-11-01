const express = require("express");
const chapters = require("../controllers/chapter.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadChapterAudio } = require("../middlewares/file-upload.middleware");

const router = express.Router();

// Public routes
router.get("/story/:storyId", chapters.findByStory);
router.get("/:id", chapters.findOne);

// Admin only routes
router.post("/", authMiddleware, chapters.create);
router.put("/:id", authMiddleware, chapters.update);
router.delete("/:id", authMiddleware, chapters.delete);

// Upload audio cho chương
router.post(
  "/upload-audio/:storyId/:chapterNumber",
  authMiddleware,
  (req, res, next) => {
    uploadChapterAudio(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  chapters.uploadAudio
);

module.exports = router;
