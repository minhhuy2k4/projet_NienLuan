const express = require("express");
const stories = require("../controllers/story.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadCoverImage } = require("../middlewares/file-upload.middleware");
const router = express.Router();

// === CÁC ROUTE CÔNG KHAI (AI CŨNG XEM ĐƯỢC) ===
router.get("/", stories.findAll);
router.get("/slug/:slug", stories.findBySlug);
router.get("/:id", stories.findOne);

// === CÁC ROUTE CẦN QUYỀN ADMIN ===
// Quản lý truyện
router.post("/", authMiddleware, stories.create);
router.put("/:id", authMiddleware, stories.update);
router.delete("/:id", authMiddleware, stories.delete);

// Upload ảnh bìa cho truyện
router.post(
  "/upload-cover/:storyId",
  authMiddleware,
  (req, res, next) => {
    uploadCoverImage(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  stories.uploadCover
);

module.exports = router;
