const { ObjectId } = require("mongodb");

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
      likes: [],
      reports: [],
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
          likes: 1,
          reports: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]).toArray();

    return created[0];
  }

  // Lấy comments theo chương (có phân trang)
  async getByChapter(chapterId, page = 1, limit = 5) {
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
        $lookup: {
          from: "comments",
          let: { commentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$parentId", "$$commentId"] } } },
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
                likes: 1,
                reports: 1,
                createdAt: 1,
                updatedAt: 1,
                "user._id": 1,
                "user.name": 1,
                "user.email": 1,
              },
            },
          ],
          as: "replies",
        },
      },
      {
        $project: {
          _id: 1,
          chapterId: 1,
          content: 1,
          likes: 1,
          reports: 1,
          createdAt: 1,
          updatedAt: 1,
          replies: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]).toArray();

    const total = await this.Comment.countDocuments({
      chapterId: new ObjectId(chapterId),
      parentId: null,
    });

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

  // Toggle like
  async toggleLike(commentId, userId) {
    const comment = await this.Comment.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      throw new Error("Comment không tồn tại");
    }

    const userObjId = new ObjectId(userId);
    const hasLiked = comment.likes.some((id) => id.equals(userObjId));

    if (hasLiked) {
      // Unlike
      await this.Comment.updateOne(
        { _id: new ObjectId(commentId) },
        {
          $pull: { likes: userObjId },
          $set: { updatedAt: new Date() },
        }
      );
      return { liked: false };
    } else {
      // Like
      await this.Comment.updateOne(
        { _id: new ObjectId(commentId) },
        {
          $addToSet: { likes: userObjId },
          $set: { updatedAt: new Date() },
        }
      );
      return { liked: true };
    }
  }

  // Báo cáo comment
  async reportComment(commentId, userId, reason) {
    const comment = await this.Comment.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      throw new Error("Comment không tồn tại");
    }

    // Kiểm tra đã báo cáo chưa
    const alreadyReported = comment.reports.some((report) =>
      report.userId.equals(new ObjectId(userId))
    );

    if (alreadyReported) {
      throw new Error("Bạn đã báo cáo comment này rồi");
    }

    await this.Comment.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $push: {
          reports: {
            userId: new ObjectId(userId),
            reason,
            createdAt: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      }
    );

    return { message: "Báo cáo thành công" };
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
          likes: 1,
          reports: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
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

    // Xóa các reply của comment này
    await this.Comment.deleteMany({ parentId: new ObjectId(commentId) });

    // Xóa comment chính
    await this.Comment.deleteOne({ _id: new ObjectId(commentId) });

    return { message: "Xóa comment thành công" };
  }

  // Lấy danh sách comment bị báo cáo (cho admin)
  async getReportedComments(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const comments = await this.Comment.aggregate([
      {
        $match: {
          "reports.0": { $exists: true }, // Có ít nhất 1 report
        },
      },
      { $sort: { "reports.0.createdAt": -1 } },
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
      { $unwind: "$user" },
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      { $unwind: "$chapter" },
      {
        $project: {
          _id: 1,
          content: 1,
          likes: 1,
          reports: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
          "chapter.ten": 1,
        },
      },
    ]).toArray();

    const total = await this.Comment.countDocuments({
      "reports.0": { $exists: true },
    });

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
