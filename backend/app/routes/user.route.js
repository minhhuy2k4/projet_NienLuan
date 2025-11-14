const express = require("express");
const userController = require("../controllers/user.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const { uploadAvatar } = require("../middlewares/file-upload.middleware");
const router = express.Router();

// Admin routes - require both auth and admin role
router.get("/admin/users", auth, isAdmin, userController.getAllUsers);
router.post("/admin/users", auth, isAdmin, userController.createUser);
router.put("/admin/users/:id", auth, isAdmin, userController.updateUser);
router.delete("/admin/users/:id", auth, isAdmin, userController.deleteUser);
router.post(
  "/admin/users/:id/reset-password",
  auth,
  isAdmin,
  userController.resetPassword
);

// Tất cả các route bên dưới đều cần xác thực
router.use(auth);

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
