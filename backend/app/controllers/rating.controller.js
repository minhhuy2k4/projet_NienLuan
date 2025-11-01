const RatingService = require("../services/rating.service");
const MongoDB = require("../utils/mongodb.util");

/**
 * Thêm hoặc cập nhật đánh giá
 */
exports.addOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId, rating, comment } = req.body;

    if (!storyId || !rating) {
      return res.status(400).send({ message: "storyId và rating là bắt buộc" });
    }

    const ratingService = new RatingService(MongoDB.client);
    const result = await ratingService.addOrUpdateRating(
      userId,
      storyId,
      rating,
      comment
    );

    res.status(200).send({
      message: "Đánh giá thành công",
      rating: result,
    });
  } catch (error) {
    console.error("Add rating error:", error);
    res.status(500).send({ message: error.message || "Lỗi khi đánh giá" });
  }
};

/**
 * Lấy đánh giá của user cho một truyện
 */
exports.getUserRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const ratingService = new RatingService(MongoDB.client);
    const rating = await ratingService.getUserRating(userId, storyId);

    res.send(rating || null);
  } catch (error) {
    console.error("Get user rating error:", error);
    res.status(500).send({ message: "Lỗi khi lấy đánh giá" });
  }
};

/**
 * Lấy tất cả đánh giá của một truyện
 */
exports.getRatingsByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const ratingService = new RatingService(MongoDB.client);
    const ratings = await ratingService.getRatingsByStory(storyId, limit, skip);

    res.send(ratings);
  } catch (error) {
    console.error("Get ratings error:", error);
    res.status(500).send({ message: "Lỗi khi lấy đánh giá" });
  }
};

/**
 * Lấy thống kê đánh giá theo sao
 */
exports.getRatingStats = async (req, res) => {
  try {
    const { storyId } = req.params;

    const ratingService = new RatingService(MongoDB.client);
    const stats = await ratingService.getRatingStats(storyId);

    res.send(stats);
  } catch (error) {
    console.error("Get rating stats error:", error);
    res.status(500).send({ message: "Lỗi khi lấy thống kê đánh giá" });
  }
};

/**
 * Xóa đánh giá của user
 */
exports.deleteRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const ratingService = new RatingService(MongoDB.client);
    await ratingService.deleteRating(userId, storyId);

    res.send({ message: "Đã xóa đánh giá" });
  } catch (error) {
    console.error("Delete rating error:", error);
    if (error.message === "Không tìm thấy đánh giá") {
      return res.status(404).send({ message: error.message });
    }
    res.status(500).send({ message: "Lỗi khi xóa đánh giá" });
  }
};

/**
 * Lấy tất cả đánh giá (Admin)
 */
exports.getAllRatings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const filter = {};

    if (req.query.storyId) {
      filter.storyId = req.query.storyId;
    }

    if (req.query.rating) {
      filter.rating = req.query.rating;
    }

    const ratingService = new RatingService(MongoDB.client);
    const result = await ratingService.getAllRatings(limit, skip, filter);

    res.send(result);
  } catch (error) {
    console.error("Get all ratings error:", error);
    res.status(500).send({ message: "Lỗi khi lấy danh sách đánh giá" });
  }
};

/**
 * Xóa đánh giá (Admin)
 */
exports.deleteRatingById = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const ratingService = new RatingService(MongoDB.client);
    await ratingService.deleteRatingById(ratingId);

    res.send({ message: "Đã xóa đánh giá" });
  } catch (error) {
    console.error("Delete rating by ID error:", error);
    if (error.message === "Không tìm thấy đánh giá") {
      return res.status(404).send({ message: error.message });
    }
    res.status(500).send({ message: "Lỗi khi xóa đánh giá" });
  }
};
