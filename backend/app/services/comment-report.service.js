const { ObjectId } = require("mongodb");

class CommentReportService {
  constructor(client) {
    this.CommentReport = client.db().collection("comment_reports");
  }

  /**
   * Báo cáo comment
   */
  async reportComment(commentId, userId, reason) {
    const userObjId = new ObjectId(userId);
    const commentObjId = new ObjectId(commentId);

    // Kiểm tra đã báo cáo chưa
    const existingReport = await this.CommentReport.findOne({
      commentId: commentObjId,
      userId: userObjId,
    });

    if (existingReport) {
      throw new Error("Bạn đã báo cáo comment này rồi");
    }

    // Thêm báo cáo mới
    const report = {
      commentId: commentObjId,
      userId: userObjId,
      reason: reason || "Nội dung không phù hợp",
      status: "pending", // pending, reviewed, dismissed
      createdAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    };

    const result = await this.CommentReport.insertOne(report);
    return await this.CommentReport.findOne({ _id: result.insertedId });
  }

  /**
   * Đếm số lượng báo cáo của 1 comment
   */
  async getReportCount(commentId) {
    return await this.CommentReport.countDocuments({
      commentId: new ObjectId(commentId),
      status: "pending",
    });
  }

  /**
   * Đếm số lượng báo cáo của nhiều comments
   */
  async getReportCounts(commentIds) {
    const objectIds = commentIds.map((id) => new ObjectId(id));

    const counts = await this.CommentReport.aggregate([
      {
        $match: {
          commentId: { $in: objectIds },
          status: "pending",
        },
      },
      {
        $group: {
          _id: "$commentId",
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const result = {};
    counts.forEach((item) => {
      result[item._id.toString()] = item.count;
    });

    return result;
  }

  /**
   * Lấy danh sách comments bị báo cáo (Admin)
   */
  async getReportedComments(page = 1, limit = 10, status = "pending") {
    const skip = (page - 1) * limit;

    const matchStage = {};
    if (status) {
      matchStage.status = status;
    }

    // Aggregate để lấy comment + số lượng báo cáo
    const comments = await this.CommentReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$commentId",
          reportCount: { $sum: 1 },
          reports: {
            $push: {
              userId: "$userId",
              reason: "$reason",
              createdAt: "$createdAt",
              status: "$status",
            },
          },
          firstReportDate: { $min: "$createdAt" },
        },
      },
      { $sort: { reportCount: -1, firstReportDate: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "_id",
          as: "comment",
        },
      },
      { $unwind: "$comment" },
      {
        $lookup: {
          from: "users",
          localField: "comment.userId",
          foreignField: "_id",
          as: "commentUser",
        },
      },
      { $unwind: "$commentUser" },
      {
        $lookup: {
          from: "chapters",
          localField: "comment.chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      { $unwind: "$chapter" },
      {
        $project: {
          _id: 1,
          reportCount: 1,
          reports: 1,
          firstReportDate: 1,
          "comment._id": 1,
          "comment.content": 1,
          "comment.createdAt": 1,
          "commentUser._id": 1,
          "commentUser.name": 1,
          "commentUser.email": 1,
          "chapter._id": 1,
          "chapter.title": 1,
          "chapter.chapterNumber": 1,
        },
      },
    ]).toArray();

    const total = await this.CommentReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$commentId",
        },
      },
      {
        $count: "total",
      },
    ]).toArray();

    return {
      comments,
      pagination: {
        page,
        limit,
        total: total[0]?.total || 0,
        totalPages: Math.ceil((total[0]?.total || 0) / limit),
      },
    };
  }

  /**
   * Lấy chi tiết báo cáo của 1 comment
   */
  async getCommentReports(commentId) {
    const reports = await this.CommentReport.aggregate([
      {
        $match: {
          commentId: new ObjectId(commentId),
        },
      },
      { $sort: { createdAt: -1 } },
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
          reason: 1,
          status: 1,
          createdAt: 1,
          reviewedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]).toArray();

    return reports;
  }

  /**
   * Xử lý báo cáo (Admin) - Chấp nhận hoặc từ chối
   */
  async reviewReports(commentId, adminId, action) {
    // action: "dismiss" hoặc "accept"
    const status = action === "dismiss" ? "dismissed" : "reviewed";

    const result = await this.CommentReport.updateMany(
      {
        commentId: new ObjectId(commentId),
        status: "pending",
      },
      {
        $set: {
          status: status,
          reviewedAt: new Date(),
          reviewedBy: new ObjectId(adminId),
        },
      }
    );

    return result;
  }

  /**
   * Xóa tất cả báo cáo của 1 comment (khi xóa comment)
   */
  async deleteCommentReports(commentId) {
    const result = await this.CommentReport.deleteMany({
      commentId: new ObjectId(commentId),
    });
    return result.deletedCount;
  }

  /**
   * Xóa tất cả báo cáo của nhiều comments
   */
  async deleteManyCommentReports(commentIds) {
    const objectIds = commentIds.map((id) => new ObjectId(id));
    const result = await this.CommentReport.deleteMany({
      commentId: { $in: objectIds },
    });
    return result.deletedCount;
  }

  /**
   * Thống kê báo cáo
   */
  async getReportStats() {
    const stats = await this.CommentReport.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const result = {
      pending: 0,
      reviewed: 0,
      dismissed: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    return result;
  }
}

module.exports = CommentReportService;
