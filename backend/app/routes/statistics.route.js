const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statistics.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

// Tất cả routes đều cần authentication (admin only)
router.use(auth);

// Lấy thống kê tổng quan
router.get("/overview", statisticsController.getOverviewStats);

// Lấy top stories theo lượt xem
router.get("/top-stories", statisticsController.getTopStories);

// Lấy thống kê mới nhất (7 ngày)
router.get("/recent", statisticsController.getRecentStats);

module.exports = router;
