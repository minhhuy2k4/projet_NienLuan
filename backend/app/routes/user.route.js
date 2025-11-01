const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// Tất cả các route bên dưới đều cần xác thực
router.use(authMiddleware);

router.get("/me", userController.getProfile);
router.post("/favorites", userController.addFavorite);
router.delete("/favorites", userController.removeFavorite); // Sử dụng DELETE và gửi storyId trong body

module.exports = router;
