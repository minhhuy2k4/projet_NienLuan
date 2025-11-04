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
      createdAt: new Date(),
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
  async getReportedComments(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Aggregate để lấy comment + số lượng báo cáo
    const comments = await this.CommentReport.aggregate([
      {
        $group: {
          _id: "$commentId",
          reportCount: { $sum: 1 },
          reports: {
            $push: {
              userId: "$userId",
              reason: "$reason",
              createdAt: "$createdAt",
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
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]).toArray();

    return reports;
  }

  /**
   * Xử lý báo cáo (Admin) - Xóa báo cáo hoặc xóa comment
   */
  async reviewReports(reportId, adminId, action) {
    // Tìm report để lấy commentId
    const report = await this.CommentReport.findOne({
      _id: new ObjectId(reportId),
    });

    if (!report) {
      throw new Error("Báo cáo không tồn tại");
    }

    if (action === "dismiss") {
      // Chỉ xóa báo cáo này
      const result = await this.CommentReport.deleteOne({
        _id: new ObjectId(reportId),
      });
      return { action: "dismissed", deletedReport: result.deletedCount };
    }

    // Nếu action là "accept", trả về commentId để controller xóa comment
    return {
      action: "accepted",
      commentId: report.commentId,
    };
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
   * Lấy danh sách tất cả reports (không nhóm theo comment) - cho admin
   */
  async getAllReports(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Lấy danh sách reports với thông tin comment và user
    const reports = await this.CommentReport.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          localField: "commentId",
          foreignField: "_id",
          as: "comment",
        },
      },
      {
        $unwind: {
          path: "$comment",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comment.userId",
          foreignField: "_id",
          as: "commentUser",
        },
      },
      {
        $unwind: {
          path: "$commentUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      {
        $unwind: {
          path: "$reportedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          reason: 1,
          createdAt: 1,
          "comment._id": 1,
          "comment.content": 1,
          "comment.createdAt": 1,
          "comment.user": {
            _id: "$commentUser._id",
            name: "$commentUser.name",
            email: "$commentUser.email",
          },
          "reportedBy._id": 1,
          "reportedBy.name": 1,
          "reportedBy.email": 1,
        },
      },
    ]).toArray();

    // Đếm tổng số
    const total = await this.CommentReport.countDocuments({});

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Thống kê báo cáo
   */
  async getReportStats() {
    const total = await this.CommentReport.countDocuments({});

    return {
      total,
    };
  }
}

module.exports = CommentReportService;
