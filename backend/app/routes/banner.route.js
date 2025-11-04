const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const auth = require("../middlewares/auth.middleware");
const { uploadBanner } = require("../middlewares/upload.middleware");

// Upload banner image
router.post("/upload", auth, uploadBanner.single("banner"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const imageUrl = `/banners/${req.file.filename}`;
    res.json({
      message: "Upload thành công",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload banner error:", error);
    res.status(500).json({ message: "Lỗi khi upload ảnh" });
  }
});

// Public routes
router.get("/active", bannerController.getActive);

// Admin routes (require authentication)
router.get("/", auth, bannerController.getAll);
router.get("/:id", auth, bannerController.getById);
router.post("/", auth, bannerController.create);
router.put("/:id", auth, bannerController.update);
router.delete("/:id", auth, bannerController.delete);
router.patch("/:id/toggle", auth, bannerController.toggleActive);

module.exports = router;
