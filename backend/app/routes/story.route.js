const express = require("express");
const stories = require("../controllers/story.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const { uploadCoverImage } = require("../middlewares/file-upload.middleware");
const router = express.Router();

// === CÁC ROUTE CÔNG KHAI (AI CŨNG XEM ĐƯỢC) ===
router.get("/", stories.findAll);
router.get("/search", stories.search);
router.get("/slug/:slug", stories.findBySlug);
router.get("/:id", stories.findOne);

// === CÁC ROUTE CẦN QUYỀN ADMIN ===
// Quản lý truyện
router.post("/", auth, isAdmin, stories.create);
router.put("/:id", auth, isAdmin, stories.update);
router.delete("/:id", auth, isAdmin, stories.delete);

// Upload ảnh bìa cho truyện
router.post(
  "/upload-cover/:storyId",
  auth,
  isAdmin,
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
