const FavoriteService = require("../services/favorite.service");
const MongoDB = require("../utils/mongodb.util");

/**
 * Thêm truyện vào yêu thích
 */
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // Từ auth middleware
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).send({ message: "storyId là bắt buộc" });
    }

    const favoriteService = new FavoriteService(MongoDB.client);
    await favoriteService.addFavorite(userId, storyId);

    res.status(201).send({ message: "Đã thêm vào yêu thích" });
  } catch (error) {
    console.error("Add favorite error:", error);
    if (error.message === "Truyện đã có trong danh sách yêu thích") {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Lỗi khi thêm yêu thích" });
  }
};

/**
 * Xóa truyện khỏi yêu thích
 */
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const favoriteService = new FavoriteService(MongoDB.client);
    await favoriteService.removeFavorite(userId, storyId);

    res.send({ message: "Đã xóa khỏi yêu thích" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    if (error.message === "Không tìm thấy trong danh sách yêu thích") {
      return res.status(404).send({ message: error.message });
    }
    res.status(500).send({ message: "Lỗi khi xóa yêu thích" });
  }
};

/**
 * Kiểm tra truyện có trong yêu thích không
 */
exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const favoriteService = new FavoriteService(MongoDB.client);
    const isFavorite = await favoriteService.isFavorite(userId, storyId);

    res.send({ isFavorite });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).send({ message: "Lỗi khi kiểm tra yêu thích" });
  }
};

/**
 * Lấy danh sách truyện yêu thích
 */
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const favoriteService = new FavoriteService(MongoDB.client);
    const result = await favoriteService.getFavoritesByUser(
      userId,
      page,
      limit
    );

    res.send(result);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).send({ message: "Lỗi khi lấy danh sách yêu thích" });
  }
};

/**
 * Toggle favorite (thêm nếu chưa có, xóa nếu đã có)
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).send({ message: "storyId là bắt buộc" });
    }

    const favoriteService = new FavoriteService(MongoDB.client);
    const isFavorite = await favoriteService.isFavorite(userId, storyId);

    if (isFavorite) {
      await favoriteService.removeFavorite(userId, storyId);
      res.send({ message: "Đã xóa khỏi yêu thích", isFavorite: false });
    } else {
      await favoriteService.addFavorite(userId, storyId);
      res.send({ message: "Đã thêm vào yêu thích", isFavorite: true });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).send({ message: "Lỗi khi toggle yêu thích" });
  }
};
