const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const auth = require("../middlewares/auth.middleware");
const { uploadBanner } = require("../middlewares/file-upload.middleware");

// Upload banner image
router.post(
  "/upload",
  auth,
  (req, res, next) => {
    uploadBanner(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  bannerController.uploadImage
);

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
