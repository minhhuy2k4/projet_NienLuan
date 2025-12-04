const HistoryService = require("../services/history.service");
const MongoDB = require("../utils/mongodb.util");

/**
 * Thêm/cập nhật lịch sử đọc
 */
exports.addHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId, chapterId } = req.body;

    if (!storyId) {
      return res.status(400).send({ message: "storyId là bắt buộc" });
    }

    const historyService = new HistoryService(MongoDB.client);
    await historyService.addOrUpdateHistory(userId, storyId, chapterId);

    res.status(200).send({ message: "Đã lưu lịch sử" });
  } catch (error) {
    console.error("Add history error:", error);
    res.status(500).send({ message: "Lỗi khi lưu lịch sử" });
  }
};

/**
 * Lấy lịch sử đọc
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const historyService = new HistoryService(MongoDB.client);
    const result = await historyService.getHistoryByUser(userId, page, limit);

    res.send(result);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).send({ message: "Lỗi khi lấy lịch sử" });
  }
};

/**
 * Xóa một lịch sử
 */
exports.removeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const historyService = new HistoryService(MongoDB.client);
    await historyService.removeHistory(userId, storyId);

    res.send({ message: "Đã xóa lịch sử" });
  } catch (error) {
    console.error("Remove history error:", error);
    if (error.message === "Không tìm thấy lịch sử") {
      return res.status(404).send({ message: error.message });
    }
    res.status(500).send({ message: "Lỗi khi xóa lịch sử" });
  }
};

/**
 * Xóa toàn bộ lịch sử
 */
exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const historyService = new HistoryService(MongoDB.client);
    const result = await historyService.clearHistory(userId);

    res.send({
      message: "Đã xóa toàn bộ lịch sử",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).send({ message: "Lỗi khi xóa lịch sử" });
  }
};
