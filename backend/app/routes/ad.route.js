const express = require("express");
const router = express.Router();
const adController = require("../controllers/ad.controller");
const auth = require("../middlewares/auth.middleware");
const { uploadAd } = require("../middlewares/upload.middleware");

// Upload ad image
router.post("/upload", auth, uploadAd.single("ad"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const imageUrl = `/ads/${req.file.filename}`;
    res.json({
      message: "Upload thành công",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload ad error:", error);
    res.status(500).json({ message: "Lỗi khi upload ảnh" });
  }
});

// Public routes
router.get("/position/:position", adController.getByPosition);
router.post("/:id/view", adController.trackView);
router.post("/:id/click", adController.trackClick);

// Admin routes (require authentication)
router.get("/", auth, adController.getAll);
router.get("/:id", auth, adController.getById);
router.post("/", auth, adController.create);
router.put("/:id", auth, adController.update);
router.delete("/:id", auth, adController.delete);
router.patch("/:id/toggle", auth, adController.toggleActive);

module.exports = router;
