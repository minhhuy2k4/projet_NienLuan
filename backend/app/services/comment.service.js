const { ObjectId } = require("mongodb");
const CommentLikeService = require("./comment-like.service");
const CommentReportService = require("./comment-report.service");

// Danh sách từ nhạy cảm (có thể mở rộng)
const SENSITIVE_WORDS = [
  // Tiếng Việt
  "đụ",
  "địt",
  "lồn",
  "buồi",
  "cặc",
  "đéo",
  "dm",
  "đm",
  "cc",
  "vl",
  "vcl",
  "đcm",
  "đkm",
  "clgt",
  "clmm",
  "đmm",
  "loz",
  "lồz",
  "ngu",
  "chó",
  "súc vật",
  "con chó",
  "thằng chó",
  "đồ chó",
  "khốn nạn",
  "đồ khốn",
  "đồ ngu",
  "đồ ngốc",
  "ngu si",
  "khùng",
  "điên",

  // Tiếng Anh
  "fuck",
  "shit",
  "ass",
  "bitch",
  "damn",
  "crap",
  "hell",
  "bastard",
  "dick",
  "cock",
  "pussy",
  "slut",
  "whore",
  "asshole",
  "motherfucker",
];

class CommentService {
  constructor(client) {
    this.Comment = client.db().collection("comments");
    this.User = client.db().collection("users");
    this.likeService = new CommentLikeService(client);
    this.reportService = new CommentReportService(client);
  }

  // Lọc từ nhạy cảm
  filterSensitiveWords(text) {
    let filtered = text;
    SENSITIVE_WORDS.forEach((word) => {
      const regex = new RegExp(word, "gi");
      filtered = filtered.replace(regex, "***");
    });
    return filtered;
  }

  // Tạo comment mới
  async create(payload) {
    const { userId, chapterId, content, parentId = null } = payload;

    // Lọc nội dung
    const filteredContent = this.filterSensitiveWords(content);

    const comment = {
      userId: new ObjectId(userId),
      chapterId: new ObjectId(chapterId),
      content: filteredContent,
      parentId: parentId ? new ObjectId(parentId) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.Comment.insertOne(comment);

    // Populate user info
    const created = await this.Comment.aggregate([
      { $match: { _id: result.insertedId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          user: {
            $ifNull: [
              "$user",
              {
                _id: "$userId",
                name: "Anonymous User",
                email: "unknown@example.com",
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          chapterId: 1,
          content: 1,
          parentId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.avatar": 1,
        },
      },
    ]).toArray();

    return created[0];
  }

  // Helper: Build nested comment tree
  async buildCommentTree(comments) {
    if (!comments || comments.length === 0) return [];

    const commentIds = comments.map((c) => c._id);

    // Lấy tất cả replies của các comments này
    const allReplies = await this.Comment.aggregate([
      {
        $match: {
          parentId: { $in: commentIds },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          user: {
            $ifNull: [
              "$user",
              {
                _id: "$userId",
                name: "Anonymous User",
                email: "unknown@example.com",
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          parentId: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.avatar": 1,
        },
      },
    ]).toArray();

    // Nếu có replies, đệ quy lấy replies của replies
    if (allReplies.length > 0) {
      const nestedReplies = await this.buildCommentTree(allReplies);

      // Merge nested replies vào parent
      const repliesMap = new Map();
      nestedReplies.forEach((reply) => {
        const parentId = reply.parentId.toString();
        if (!repliesMap.has(parentId)) {
          repliesMap.set(parentId, []);
        }
        repliesMap.get(parentId).push(reply);
      });

      // Gắn replies vào comments
      comments.forEach((comment) => {
        const replies = repliesMap.get(comment._id.toString()) || [];
        comment.replies = replies;
      });
    } else {
      comments.forEach((comment) => {
        comment.replies = [];
      });
    }

    return comments;
  }

  // Lấy comments theo chương (có phân trang)
  async getByChapter(chapterId, page = 1, limit = 5, userId = null) {
    const skip = (page - 1) * limit;

    // Chỉ lấy comment cấp 1 (không có parentId)
    const comments = await this.Comment.aggregate([
      {
        $match: {
          chapterId: new ObjectId(chapterId),
          parentId: null,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          user: {
            $ifNull: [
              "$user",
              {
                _id: "$userId",
                name: "Anonymous User",
                email: "unknown@example.com",
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          chapterId: 1,
          content: 1,
          userId: 1,
          parentId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.avatar": 1,
        },
      },
    ]).toArray();

    // Build nested tree
    const commentsWithReplies = await this.buildCommentTree(comments);

    // Collect all comment IDs (flatten tree)
    const allCommentIds = [];
    const collectIds = (comments) => {
      comments.forEach((comment) => {
        allCommentIds.push(comment._id.toString());
        if (comment.replies && comment.replies.length > 0) {
          collectIds(comment.replies);
        }
      });
    };
    collectIds(commentsWithReplies);

    const likeCounts = await this.likeService.getLikeCounts(allCommentIds);
    const reportCounts =
      await this.reportService.getReportCounts(allCommentIds);

    // Nếu có userId, kiểm tra user đã like comments nào
    let userLikedComments = [];
    if (userId) {
      userLikedComments = await this.likeService.getUserLikedComments(
        allCommentIds,
        userId
      );
    }

    // Thêm thông tin likes và reports vào comments (recursive)
    const addLikeInfo = (comments) => {
      comments.forEach((comment) => {
        const commentIdStr = comment._id.toString();
        comment.likeCount = likeCounts[commentIdStr] || 0;
        comment.reportCount = reportCounts[commentIdStr] || 0;
        comment.isLiked = userLikedComments.includes(commentIdStr);

        if (comment.replies && comment.replies.length > 0) {
          addLikeInfo(comment.replies);
        }
      });
    };
    addLikeInfo(commentsWithReplies);

    const total = await this.Comment.countDocuments({
      chapterId: new ObjectId(chapterId),
      parentId: null,
    });

    return {
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Toggle like
  async toggleLike(commentId, userId) {
    // Kiểm tra comment có tồn tại không
    const comment = await this.Comment.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      throw new Error("Comment không tồn tại");
    }

    // Sử dụng CommentLikeService
    return await this.likeService.toggleLike(commentId, userId);
  }

  // Báo cáo comment
  async reportComment(commentId, userId, reason) {
    // Kiểm tra comment có tồn tại không
    const comment = await this.Comment.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      throw new Error("Comment không tồn tại");
    }

    // Sử dụng CommentReportService
    return await this.reportService.reportComment(commentId, userId, reason);
  }

  // Cập nhật comment
  async update(commentId, userId, content) {
    const comment = await this.Comment.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      throw new Error("Comment không tồn tại");
    }

    // Kiểm tra quyền sở hữu
    if (!comment.userId.equals(new ObjectId(userId))) {
      throw new Error("Bạn không có quyền chỉnh sửa comment này");
    }

    const filteredContent = this.filterSensitiveWords(content);

    await this.Comment.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: filteredContent,
          updatedAt: new Date(),
        },
      }
    );

    // Populate user info
    const updated = await this.Comment.aggregate([
      { $match: { _id: new ObjectId(commentId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          user: {
            $ifNull: [
              "$user",
              {
                _id: "$userId",
                name: "Anonymous User",
                email: "unknown@example.com",
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          chapterId: 1,
          content: 1,
          parentId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.avatar": 1,
        },
      },
    ]).toArray();

    return updated[0];
  }

  // Xóa comment
  async delete(commentId, userId, isAdmin = false) {
    const comment = await this.Comment.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      throw new Error("Comment không tồn tại");
    }

    // Kiểm tra quyền: chủ sở hữu hoặc admin
    if (!isAdmin && !comment.userId.equals(new ObjectId(userId))) {
      throw new Error("Bạn không có quyền xóa comment này");
    }

    // Lấy tất cả reply IDs
    const replyIds = await this.Comment.find(
      { parentId: new ObjectId(commentId) },
      { projection: { _id: 1 } }
    ).toArray();

    const allCommentIds = [commentId, ...replyIds.map((r) => r._id.toString())];

    // Xóa các reply của comment này
    await this.Comment.deleteMany({ parentId: new ObjectId(commentId) });

    // Xóa comment chính
    await this.Comment.deleteOne({ _id: new ObjectId(commentId) });

    // Xóa tất cả likes và reports liên quan
    await this.likeService.deleteManyCommentLikes(allCommentIds);
    await this.reportService.deleteManyCommentReports(allCommentIds);

    return { message: "Xóa comment thành công" };
  }

  // Lấy danh sách comment bị báo cáo (cho admin)
  async getReportedComments(page = 1, limit = 10) {
    return await this.reportService.getAllReports(page, limit);
  }

  // Xử lý báo cáo (Admin)
  async reviewReports(commentId, adminId, action) {
    return await this.reportService.reviewReports(commentId, adminId, action);
  }

  // Lấy thống kê báo cáo
  async getReportStats() {
    return await this.reportService.getReportStats();
  }

  // Admin: Lấy tất cả comments với tìm kiếm
  async getAllComments(page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (search) {
      query.content = { $regex: search, $options: "i" };
    }

    // Get comments with user info and counts
    const comments = await this.Comment.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          chapterId: 1,
          parentId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.avatar": 1,
        },
      },
    ]).toArray();

    // Get all comment IDs
    const commentIds = comments.map((c) => c._id.toString());

    // Get like counts and report counts
    const likeCounts = await this.likeService.getLikeCounts(commentIds);
    const reportCounts = await this.reportService.getReportCounts(commentIds);

    // Count replies for each comment
    const replyCountsPromises = comments.map(async (comment) => {
      const count = await this.Comment.countDocuments({
        parentId: comment._id,
      });
      return { id: comment._id.toString(), count };
    });
    const replyCounts = await Promise.all(replyCountsPromises);
    const replyCountMap = Object.fromEntries(
      replyCounts.map((r) => [r.id, r.count])
    );

    // Add counts to comments
    comments.forEach((comment) => {
      const commentIdStr = comment._id.toString();
      comment.likeCount = likeCounts[commentIdStr] || 0;
      comment.reportCount = reportCounts[commentIdStr] || 0;
      comment.replyCount = replyCountMap[commentIdStr] || 0;
    });

    // Get total count
    const total = await this.Comment.countDocuments(query);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = CommentService;
