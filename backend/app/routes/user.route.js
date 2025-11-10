const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadAvatar } = require("../middlewares/file-upload.middleware");
const router = express.Router();

// Tất cả các route bên dưới đều cần xác thực
router.use(authMiddleware);

router.get("/me", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put(
  "/avatar",
  (req, res, next) => {
    uploadAvatar(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  userController.updateAvatar
);
router.put("/password", userController.changePassword);
router.post("/favorites", userController.addFavorite);
router.delete("/favorites", userController.removeFavorite); // Sử dụng DELETE và gửi storyId trong body

module.exports = router;
