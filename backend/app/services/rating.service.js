const { ObjectId } = require("mongodb");

class RatingService {
  constructor(client) {
    this.Rating = client.db().collection("ratings");
    this.Story = client.db().collection("stories");
  }

  /**
   * Thêm hoặc cập nhật đánh giá
   */
  async addOrUpdateRating(userId, storyId, ratingValue, comment = "") {
    // Validate rating value (1-5)
    if (ratingValue < 1 || ratingValue > 5) {
      throw new Error("Đánh giá phải từ 1 đến 5 sao");
    }

    const filter = {
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    };

    const updateData = {
      $set: {
        rating: ratingValue,
        comment: comment || "",
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId: new ObjectId(userId),
        storyId: new ObjectId(storyId),
        createdAt: new Date(),
      },
    };

    const result = await this.Rating.findOneAndUpdate(filter, updateData, {
      upsert: true,
      returnDocument: "after",
    });

    // Cập nhật rating trung bình của truyện
    await this.updateStoryAverageRating(storyId);

    return result;
  }

  /**
   * Cập nhật rating trung bình và tổng số đánh giá của truyện
   */
  async updateStoryAverageRating(storyId) {
    const stats = await this.Rating.aggregate([
      {
        $match: { storyId: new ObjectId(storyId) },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]).toArray();

    if (stats.length > 0) {
      await this.Story.updateOne(
        { _id: new ObjectId(storyId) },
        {
          $set: {
            averageRating: Math.round(stats[0].averageRating * 10) / 10, // Làm tròn 1 chữ số
            totalRatings: stats[0].totalRatings,
          },
        }
      );
    } else {
      await this.Story.updateOne(
        { _id: new ObjectId(storyId) },
        {
          $set: {
            averageRating: 0,
            totalRatings: 0,
          },
        }
      );
    }
  }

  /**
   * Lấy đánh giá của user cho một truyện
   */
  async getUserRating(userId, storyId) {
    return await this.Rating.findOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });
  }

  /**
   * Lấy tất cả đánh giá của một truyện
   */
  async getRatingsByStory(storyId, limit = 50, skip = 0) {
    const ratings = await this.Rating.aggregate([
      {
        $match: { storyId: new ObjectId(storyId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]).toArray();

    return ratings;
  }

  /**
   * Lấy tất cả đánh giá (cho admin)
   */
  async getAllRatings(limit = 50, skip = 0, filter = {}) {
    const matchStage = {};

    // Filter by story
    if (filter.storyId) {
      matchStage.storyId = new ObjectId(filter.storyId);
    }

    // Filter by rating value
    if (filter.rating) {
      matchStage.rating = parseInt(filter.rating);
    }

    const ratings = await this.Rating.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
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
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "story._id": 1,
          "story.name": 1,
          "story.image": 1,
          "story.slug": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]).toArray();

    // Get total count
    const totalCount = await this.Rating.countDocuments(matchStage);

    return { ratings, totalCount };
  }

  /**
   * Xóa đánh giá
   */
  async deleteRating(userId, storyId) {
    const result = await this.Rating.deleteOne({
      userId: new ObjectId(userId),
      storyId: new ObjectId(storyId),
    });

    if (result.deletedCount === 0) {
      throw new Error("Không tìm thấy đánh giá");
    }

    // Cập nhật lại rating trung bình
    await this.updateStoryAverageRating(storyId);

    return result;
  }

  /**
   * Xóa đánh giá (admin - by rating ID)
   */
  async deleteRatingById(ratingId) {
    const rating = await this.Rating.findOne({ _id: new ObjectId(ratingId) });

    if (!rating) {
      throw new Error("Không tìm thấy đánh giá");
    }

    const result = await this.Rating.deleteOne({ _id: new ObjectId(ratingId) });

    // Cập nhật lại rating trung bình
    await this.updateStoryAverageRating(rating.storyId);

    return result;
  }

  /**
   * Lấy thống kê đánh giá theo sao
   */
  async getRatingStats(storyId) {
    const stats = await this.Rating.aggregate([
      {
        $match: { storyId: new ObjectId(storyId) },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]).toArray();

    // Format thành object {5: count, 4: count, ...}
    const result = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    stats.forEach((stat) => {
      result[stat._id] = stat.count;
    });

    return result;
  }
}

module.exports = RatingService;
