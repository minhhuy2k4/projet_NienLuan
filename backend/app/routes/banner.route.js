const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const { uploadBanner } = require("../middlewares/file-upload.middleware");

// Upload banner image
router.post(
  "/upload",
  auth,
  isAdmin,
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
router.get("/", auth, isAdmin, bannerController.getAll);
router.get("/:id", auth, isAdmin, bannerController.getById);
router.post("/", auth, isAdmin, bannerController.create);
router.put("/:id", auth, isAdmin, bannerController.update);
router.delete("/:id", auth, isAdmin, bannerController.delete);
router.patch("/:id/toggle", auth, isAdmin, bannerController.toggleActive);

module.exports = router;
