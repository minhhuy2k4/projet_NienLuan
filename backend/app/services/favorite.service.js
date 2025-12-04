const { ObjectId } = require("mongodb");

class FavoriteService {
  constructor(client) {
    this.User = client.db().collection("users");
    this.Story = client.db().collection("stories");
  }

  /**
   * Thêm truyện vào danh sách yêu thích (dùng user.favorites)
   */
  async addFavorite(userId, storyId) {
    // Kiểm tra xem đã yêu thích chưa
    const user = await this.User.findOne({
      _id: new ObjectId(userId),
      favorites: new ObjectId(storyId),
    });

    if (user) {
      throw new Error("Truyện đã có trong danh sách yêu thích");
    }

    // Thêm vào mảng favorites của user
    const result = await this.User.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: { favorites: new ObjectId(storyId) },
        $set: { updatedAt: new Date() },
      }
    );

    return result;
  }

  /**
   * Xóa truyện khỏi danh sách yêu thích
   */
  async removeFavorite(userId, storyId) {
    const result = await this.User.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: { favorites: new ObjectId(storyId) },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Không tìm thấy trong danh sách yêu thích");
    }

    return result;
  }

  /**
   * Kiểm tra truyện có trong danh sách yêu thích không
   */
  async isFavorite(userId, storyId) {
    const user = await this.User.findOne({
      _id: new ObjectId(userId),
      favorites: new ObjectId(storyId),
    });

    return !!user;
  }

  /**
   * Lấy danh sách truyện yêu thích của user (với thông tin đầy đủ)
   * Tối ưu: Query trực tiếp từ user.favorites
   */
  async getFavoritesByUser(userId, page = 1, limit = 12) {
    const skip = (page - 1) * limit;

    // First, get total count
    const user = await this.User.findOne(
      { _id: new ObjectId(userId) },
      { projection: { favorites: 1 } }
    );
    const total = user?.favorites?.length || 0;

    // Then get paginated results
    const result = await this.User.aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
      // Unwind favorites array
      {
        $unwind: {
          path: "$favorites",
          preserveNullAndEmptyArrays: false,
        },
      },
      // Lookup stories
      {
        $lookup: {
          from: "stories",
          localField: "favorites",
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
      // Add fields
      {
        $addFields: {
          "story.chapterCount": { $size: "$story.chapters" },
          "story.totalViews": { $sum: "$story.chapters.views" },
        },
      },
      // Remove chapters array
      {
        $project: {
          story: 1,
        },
      },
      // Replicate root with story
      {
        $replaceRoot: { newRoot: "$story" },
      },
      // Skip and limit for pagination
      { $skip: skip },
      { $limit: limit },
    ]).toArray();

    return {
      favorites: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Đếm số lượt yêu thích của một truyện
   * Tối ưu: Đếm số user có storyId trong favorites
   */
  async countFavorites(storyId) {
    return await this.User.countDocuments({
      favorites: new ObjectId(storyId),
    });
  }
}

module.exports = FavoriteService;
