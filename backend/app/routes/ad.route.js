const express = require("express");
const router = express.Router();
const adController = require("../controllers/ad.controller");
const auth = require("../middlewares/auth.middleware");
const { uploadAd } = require("../middlewares/file-upload.middleware");

// Upload ad image
router.post(
  "/upload",
  auth,
  (req, res, next) => {
    uploadAd(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  adController.uploadImage
);

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
