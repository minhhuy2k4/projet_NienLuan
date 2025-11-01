const { ObjectId } = require("mongodb");

class HistoryService {
  constructor(client) {
    this.History = client.db().collection("histories");
  }

  /**
   * Thêm/cập nhật lịch sử đọc
   * Nếu đã có thì update lastReadAt, nếu chưa thì tạo mới
   */
  async addOrUpdateHistory(userId, storyId, chapterId = null) {
    const filter = {
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    };

    const updateData = {
      $set: {
        lastReadAt: new Date(),
      },
      $setOnInsert: {
        userId: new ObjectId(userId),
        storyId: new ObjectId(storyId),
        createdAt: new Date(),
      },
    };

    // Nếu có chapterId thì lưu chương đang đọc
    if (chapterId) {
      updateData.$set.lastChapterId = new ObjectId(chapterId);
    }

    const result = await this.History.findOneAndUpdate(filter, updateData, {
      upsert: true,
      returnDocument: "after",
    });

    return result;
  }

  /**
   * Lấy lịch sử đọc của user (với thông tin đầy đủ)
   */
  async getHistoryByUser(userId, limit = 50) {
    const histories = await this.History.aggregate([
      {
        $match: { userId: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: "stories",
          localField: "storyId",
          foreignField: "_id",
          as: "story",
        },
      },
      {
        $unwind: "$story",
      },
      // Lookup authors
      {
        $lookup: {
          from: "authors",
          localField: "story.authors",
          foreignField: "_id",
          as: "story.authorDetails",
        },
      },
      // Lookup categories
      {
        $lookup: {
          from: "categories",
          localField: "story.categories",
          foreignField: "_id",
          as: "story.categoryDetails",
        },
      },
      // Lookup chapters để đếm
      {
        $lookup: {
          from: "chapters",
          localField: "story._id",
          foreignField: "storyId",
          as: "story.chapters",
        },
      },
      // Lookup chapter đang đọc (nếu có)
      {
        $lookup: {
          from: "chapters",
          localField: "lastChapterId",
          foreignField: "_id",
          as: "lastChapter",
        },
      },
      // Add fields
      {
        $addFields: {
          "story.chapterCount": { $size: "$story.chapters" },
          "story.totalViews": { $sum: "$story.chapters.views" },
          lastChapter: { $arrayElemAt: ["$lastChapter", 0] },
        },
      },
      // Remove chapters array
      {
        $project: {
          "story.chapters": 0,
        },
      },
      // Sort by lastReadAt descending
      {
        $sort: { lastReadAt: -1 },
      },
      // Limit results
      {
        $limit: limit,
      },
    ]).toArray();

    return histories.map((history) => ({
      ...history.story,
      historyId: history._id,
      lastReadAt: history.lastReadAt,
      lastChapter: history.lastChapter,
      createdAt: history.createdAt,
    }));
  }

  /**
   * Xóa một lịch sử
   */
  async removeHistory(userId, storyId) {
    const result = await this.History.deleteOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });

    if (result.deletedCount === 0) {
      throw new Error("Không tìm thấy lịch sử");
    }

    return result;
  }

  /**
   * Xóa toàn bộ lịch sử của user
   */
  async clearHistory(userId) {
    const result = await this.History.deleteMany({
      userId: new ObjectId(userId),
    });

    return result;
  }

  /**
   * Kiểm tra truyện có trong lịch sử không
   */
  async hasHistory(userId, storyId) {
    const history = await this.History.findOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });

    return !!history;
  }
}

module.exports = HistoryService;
