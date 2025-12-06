const MongoDB = require("../utils/mongodb.util");
const CommentService = require("../services/comment.service");

// Tạo comment mới
exports.create = async (req, res, next) => {
  try {
    const { chapterId, content, parentId } = req.body;
    const userId = req.user.id;

    if (!chapterId || !content) {
      return res
        .status(400)
        .json({ message: "Chapter ID and content are required" });
    }

    if (content.trim().length < 1) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ message: "Content too long (max 1000 characters)" });
    }

    const commentService = new CommentService(await MongoDB.client);
    const comment = await commentService.create({
      userId,
      chapterId,
      content,
      parentId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment error:", error);
    next(error);
  }
};

// Lấy comments của chapter
exports.getByChapter = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const page = Math.floor(skip / limit) + 1;

    // Lấy userId nếu user đã đăng nhập (optional)
    const userId = req.user?.id || null;

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.getByChapter(
      chapterId,
      page,
      limit,
      userId
    );

    res.json(result);
  } catch (error) {
    console.error("Get comments error:", error);
    next(error);
  }
};

// Toggle like
exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.toggleLike(id, userId);

    res.json(result);
  } catch (error) {
    console.error("Toggle like error:", error);
    next(error);
  }
};

// Report comment
exports.report = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
    }

    const commentService = new CommentService(await MongoDB.client);
    const comment = await commentService.reportComment(id, userId, reason);

    res.json(comment);
  } catch (error) {
    console.error("Report comment error:", error);
    next(error);
  }
};

// Cập nhật comment
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const commentService = new CommentService(await MongoDB.client);
    const comment = await commentService.update(id, userId, content);

    res.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    if (error.message === "Unauthorized") {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" });
    }
    next(error);
  }
};

// Xóa comment
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.delete(id, userId, isAdmin);

    res.json(result);
  } catch (error) {
    console.error("Delete comment error:", error);
    if (error.message === "Unauthorized") {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }
    next(error);
  }
};

// Admin: Get reported comments
exports.getReported = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const page = Math.floor(skip / limit) + 1;

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.getReportedComments(page, limit);

    res.json(result);
  } catch (error) {
    console.error("Get reported comments error:", error);
    next(error);
  }
};

// Admin: Get reported comments with filters
exports.getReportedCommentsWithFilters = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.getReportedComments(page, limit);

    res.json(result);
  } catch (error) {
    console.error("Get reported comments with filters error:", error);
    next(error);
  }
};

// Admin: Get report statistics
exports.getReportStats = async (req, res, next) => {
  try {
    const commentService = new CommentService(await MongoDB.client);
    const stats = await commentService.getReportStats();

    res.json(stats);
  } catch (error) {
    console.error("Get report stats error:", error);
    next(error);
  }
};

// Admin: Review report
exports.reviewReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { action } = req.body; // 'accept' or 'dismiss'
    const adminId = req.user._id;

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.reviewReports(
      reportId,
      adminId,
      action
    );

    // Nếu action là "accept", xóa comment
    if (result.action === "accepted" && result.commentId) {
      await commentService.delete(result.commentId);
      res.json({
        message: "Đã xóa bình luận và tất cả báo cáo liên quan",
        deletedComment: true,
      });
    } else {
      res.json({
        message: "Đã bỏ qua báo cáo",
        deletedReport: true,
      });
    }
  } catch (error) {
    console.error("Review report error:", error);
    next(error);
  }
};

// Admin: Get all comments with search
exports.getAllComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const commentService = new CommentService(await MongoDB.client);
    const result = await commentService.getAllComments(page, limit, search);

    res.json(result);
  } catch (error) {
    console.error("Get all comments error:", error);
    next(error);
  }
};
