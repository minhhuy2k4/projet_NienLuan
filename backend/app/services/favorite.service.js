const { ObjectId } = require("mongodb");

class FavoriteService {
  constructor(client) {
    this.Favorite = client.db().collection("favorites");
  }

  /**
   * Thêm truyện vào danh sách yêu thích
   */
  async addFavorite(userId, storyId) {
    // Kiểm tra xem đã yêu thích chưa
    const existing = await this.Favorite.findOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });

    if (existing) {
      throw new Error("Truyện đã có trong danh sách yêu thích");
    }

    const favoriteData = {
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
      createdAt: new Date(),
    };

    const result = await this.Favorite.insertOne(favoriteData);
    return result;
  }

  /**
   * Xóa truyện khỏi danh sách yêu thích
   */
  async removeFavorite(userId, storyId) {
    const result = await this.Favorite.deleteOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });

    if (result.deletedCount === 0) {
      throw new Error("Không tìm thấy trong danh sách yêu thích");
    }

    return result;
  }

  /**
   * Kiểm tra truyện có trong danh sách yêu thích không
   */
  async isFavorite(userId, storyId) {
    const favorite = await this.Favorite.findOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });

    return !!favorite;
  }

  /**
   * Lấy danh sách truyện yêu thích của user (với thông tin đầy đủ)
   */
  async getFavoritesByUser(userId) {
    const favorites = await this.Favorite.aggregate([
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
          "story.chapters": 0,
        },
      },
      // Sort by createdAt descending
      {
        $sort: { createdAt: -1 },
      },
    ]).toArray();

    return favorites.map((fav) => ({
      ...fav.story,
      favoriteId: fav._id,
      favoritedAt: fav.createdAt,
    }));
  }

  /**
   * Đếm số lượt yêu thích của một truyện
   */
  async countFavorites(storyId) {
    return await this.Favorite.countDocuments({
      storyId: new ObjectId(storyId),
    });
  }
}

module.exports = FavoriteService;
