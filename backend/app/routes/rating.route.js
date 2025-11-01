const express = require("express");
const ratingController = require("../controllers/rating.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// User routes (cần auth)
router.use(auth);

// Thêm/cập nhật đánh giá
router.post("/", ratingController.addOrUpdateRating);

// Lấy đánh giá của user cho một truyện
router.get("/user/:storyId", ratingController.getUserRating);

// Lấy tất cả đánh giá của một truyện
router.get("/story/:storyId", ratingController.getRatingsByStory);

// Lấy thống kê đánh giá
router.get("/stats/:storyId", ratingController.getRatingStats);

// Xóa đánh giá của user
router.delete("/:storyId", ratingController.deleteRating);

// Admin routes
router.get("/admin/all", ratingController.getAllRatings);
router.delete("/admin/:ratingId", ratingController.deleteRatingById);

module.exports = router;
