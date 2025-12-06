const StatisticsService = require("../services/statistics.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Lấy thống kê tổng quan
exports.getOverviewStats = async (req, res, next) => {
  try {
    const statsService = new StatisticsService(MongoDB.client);
    const stats = await statsService.getOverviewStats();
    res.json(stats);
  } catch (error) {
    console.error("Get overview stats error:", error);
    next(new ApiError(500, "Lỗi khi lấy thống kê tổng quan"));
  }
};

// Lấy top stories theo lượt xem
exports.getTopStories = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const statsService = new StatisticsService(MongoDB.client);
    const stories = await statsService.getTopStories(parseInt(limit));
    res.json(stories);
  } catch (error) {
    console.error("Get top stories error:", error);
    next(new ApiError(500, "Lỗi khi lấy top stories"));
  }
};

// Lấy thống kê mới nhất
exports.getRecentStats = async (req, res, next) => {
  try {
    const statsService = new StatisticsService(MongoDB.client);
    const stats = await statsService.getRecentStats();
    res.json(stats);
  } catch (error) {
    console.error("Get recent stats error:", error);
    next(new ApiError(500, "Lỗi khi lấy thống kê mới nhất"));
  }
};
