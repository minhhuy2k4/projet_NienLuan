const express = require("express");
const favorites = require("../controllers/favorite.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

// Tất cả routes yêu cầu đăng nhập
router.use(auth);

// Toggle favorite (thêm/xóa)
router.post("/toggle", favorites.toggleFavorite);

// Lấy danh sách yêu thích
router.get("/", favorites.getFavorites);

// Kiểm tra truyện có trong yêu thích không
router.get("/check/:storyId", favorites.checkFavorite);

// Thêm vào yêu thích
router.post("/", favorites.addFavorite);

// Xóa khỏi yêu thích
router.delete("/:storyId", favorites.removeFavorite);

module.exports = router;
