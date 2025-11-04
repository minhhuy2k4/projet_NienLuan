const { ObjectId } = require("mongodb");

class CommentLikeService {
  constructor(client) {
    this.CommentLike = client.db().collection("comment_likes");
  }

  /**
   * Toggle like - Thêm/xóa like
   */
  async toggleLike(commentId, userId) {
    const userObjId = new ObjectId(userId);
    const commentObjId = new ObjectId(commentId);

    // Kiểm tra đã like chưa
    const existingLike = await this.CommentLike.findOne({
      commentId: commentObjId,
      userId: userObjId,
    });

    if (existingLike) {
      // Unlike - Xóa like
      await this.CommentLike.deleteOne({
        commentId: commentObjId,
        userId: userObjId,
      });
      return { liked: false, action: "unliked" };
    } else {
      // Like - Thêm like mới
      await this.CommentLike.insertOne({
        commentId: commentObjId,
        userId: userObjId,
        createdAt: new Date(),
      });
      return { liked: true, action: "liked" };
    }
  }

  /**
   * Đếm số lượng like của 1 comment
   */
  async getLikeCount(commentId) {
    return await this.CommentLike.countDocuments({
      commentId: new ObjectId(commentId),
    });
  }

  /**
   * Đếm số lượng like của nhiều comments
   */
  async getLikeCounts(commentIds) {
    const objectIds = commentIds.map((id) => new ObjectId(id));

    const counts = await this.CommentLike.aggregate([
      {
        $match: {
          commentId: { $in: objectIds },
        },
      },
      {
        $group: {
          _id: "$commentId",
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    // Chuyển về object: { commentId: count }
    const result = {};
    counts.forEach((item) => {
      result[item._id.toString()] = item.count;
    });

    return result;
  }

  /**
   * Kiểm tra user đã like comment chưa
   */
  async hasUserLiked(commentId, userId) {
    const like = await this.CommentLike.findOne({
      commentId: new ObjectId(commentId),
      userId: new ObjectId(userId),
    });
    return !!like;
  }

  /**
   * Kiểm tra user đã like các comments nào
   */
  async getUserLikedComments(commentIds, userId) {
    const objectIds = commentIds.map((id) => new ObjectId(id));

    const likes = await this.CommentLike.find({
      commentId: { $in: objectIds },
      userId: new ObjectId(userId),
    }).toArray();

    return likes.map((like) => like.commentId.toString());
  }

  /**
   * Lấy danh sách users đã like comment
   */
  async getLikeUsers(commentId, limit = 10) {
    const likes = await this.CommentLike.aggregate([
      {
        $match: {
          commentId: new ObjectId(commentId),
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]).toArray();

    return likes;
  }

  /**
   * Xóa tất cả likes của 1 comment (khi xóa comment)
   */
  async deleteCommentLikes(commentId) {
    const result = await this.CommentLike.deleteMany({
      commentId: new ObjectId(commentId),
    });
    return result.deletedCount;
  }

  /**
   * Xóa tất cả likes của nhiều comments
   */
  async deleteManyCommentLikes(commentIds) {
    const objectIds = commentIds.map((id) => new ObjectId(id));
    const result = await this.CommentLike.deleteMany({
      commentId: { $in: objectIds },
    });
    return result.deletedCount;
  }
}

module.exports = CommentLikeService;
