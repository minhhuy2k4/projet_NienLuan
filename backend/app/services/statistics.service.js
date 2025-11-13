const { ObjectId } = require("mongodb");

class StatisticsService {
  constructor(client) {
    this.Story = client.db().collection("stories");
    this.Chapter = client.db().collection("chapters");
    this.Author = client.db().collection("authors");
    this.Category = client.db().collection("categories");
    this.User = client.db().collection("users");
  }

  /**
   * Lấy thống kê tổng quan
   */
  async getOverviewStats() {
    try {
      // Đếm tổng số documents
      const [totalStories, totalAuthors, totalCategories, totalUsers] =
        await Promise.all([
          this.Story.countDocuments(),
          this.Author.countDocuments(),
          this.Category.countDocuments(),
          this.User.countDocuments(),
        ]);

      // Tính tổng views từ tất cả chapters
      const viewsResult = await this.Chapter.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: { $ifNull: ["$views", 0] } },
          },
        },
      ]).toArray();

      const totalViews = viewsResult[0]?.totalViews || 0;

      return {
        totalStories,
        totalViews,
        totalListens: totalViews, // Alias cho totalViews
        totalAuthors,
        totalCategories,
        totalUsers,
      };
    } catch (error) {
      console.error("Get overview stats error:", error);
      throw error;
    }
  }

  /**
   * Lấy top stories theo lượt xem
   */
  async getTopStories(limit = 10) {
    try {
      const stories = await this.Story.aggregate([
        {
          $lookup: {
            from: "chapters",
            localField: "_id",
            foreignField: "storyId",
            as: "chapters",
          },
        },
        {
          $addFields: {
            // Ưu tiên dùng story.views nếu có, nếu không thì tính từ chapters
            totalViews: {
              $ifNull: [
                "$views",
                {
                  $sum: {
                    $map: {
                      input: "$chapters",
                      as: "chapter",
                      in: { $ifNull: ["$$chapter.views", 0] },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $sort: { totalViews: -1 },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            name: 1,
            slug: 1,
            image: 1,
            totalViews: 1,
            chapterCount: { $size: "$chapters" },
          },
        },
      ]).toArray();

      console.log("Top stories result:", stories);
      return stories;
    } catch (error) {
      console.error("Get top stories error:", error);
      throw error;
    }
  }

  /**
   * Lấy thống kê mới nhất (7 ngày gần nhất)
   */
  async getRecentStats() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [newStories, newChapters, totalViews] = await Promise.all([
        this.Story.countDocuments({
          createdAt: { $gte: sevenDaysAgo },
        }),
        this.Chapter.countDocuments({
          createdAt: { $gte: sevenDaysAgo },
        }),
        this.Chapter.aggregate([
          {
            $match: {
              createdAt: { $gte: sevenDaysAgo },
            },
          },
          {
            $group: {
              _id: null,
              totalViews: { $sum: "$views" },
            },
          },
        ]).toArray(),
      ]);

      return {
        newStories,
        newChapters,
        newViews: totalViews[0]?.totalViews || 0,
      };
    } catch (error) {
      console.error("Get recent stats error:", error);
      throw error;
    }
  }
}

module.exports = StatisticsService;
