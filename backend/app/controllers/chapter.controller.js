const ChapterService = require("../services/chapter.service");
const StoryService = require("../services/story.service");
const chatbotSync = require("../services/chatbot_services/chatbot-sync.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const {
  getChapterAudioUrl,
  deleteChapterAudio,
} = require("../middlewares/file-upload.middleware");

exports.create = async (req, res, next) => {
  if (!req.body?.title || !req.body?.storyId) {
    return next(new ApiError(400, "Tiêu đề và ID truyện là bắt buộc"));
  }
  try {
    const chapterService = new ChapterService(MongoDB.client);

    // Tự động tạo số chương tiếp theo nếu không có
    if (!req.body.chapterNumber) {
      req.body.chapterNumber = await chapterService.getNextChapterNumber(
        req.body.storyId
      );
    }

    const chapter = await chapterService.create(req.body);

    // Sync stories để cập nhật số chương
    const storyService = new StoryService(MongoDB.client);
    const allStories = await storyService.find({});
    await chatbotSync.syncStories(allStories);

    res.status(201).send(chapter);
  } catch (error) {
    console.error("Create chapter error:", error);
    next(new ApiError(500, "Lỗi khi tạo chương: " + error.message));
  }
};

exports.uploadAudio = async (req, res, next) => {
  try {
    const { storyId, chapterNumber } = req.params;
    const chapterService = new ChapterService(MongoDB.client);

    // Tìm chapter
    const chapter = await chapterService.findByStoryAndChapter(
      storyId,
      chapterNumber
    );
    if (!chapter) {
      return next(new ApiError(404, "Không tìm thấy chương"));
    }

    // Tạo URL cho file audio
    const audioUrl = getChapterAudioUrl(req, storyId, chapterNumber);

    // Cập nhật chỉ audioUrl vào database (không spread toàn bộ chapter)
    const updatedChapter = await chapterService.update(chapter._id, {
      audioUrl: audioUrl,
    });

    res.send({
      message: "Upload audio thành công",
      audioUrl: audioUrl,
      chapter: updatedChapter,
    });
  } catch (error) {
    console.error("Upload chapter audio error:", error);
    next(new ApiError(500, "Lỗi khi upload audio: " + error.message));
  }
};

exports.findByStory = async (req, res, next) => {
  try {
    const chapterService = new ChapterService(MongoDB.client);
    const chapters = await chapterService.findByStoryId(req.params.storyId);
    res.send(chapters);
  } catch (error) {
    console.error("Find chapters error:", error);
    next(new ApiError(500, "Lỗi khi tải danh sách chương"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const chapterService = new ChapterService(MongoDB.client);
    const chapter = await chapterService.findById(req.params.id);
    if (!chapter) {
      return next(new ApiError(404, "Không tìm thấy chương"));
    }

    // Tăng view count của chương
    await chapterService.incrementViews(req.params.id);

    // Cập nhật tổng lượt nghe của truyện
    const storyService = new StoryService(MongoDB.client);
    await storyService.updateTotalListens(chapter.storyId.toString());

    res.send(chapter);
  } catch (error) {
    console.error("Find chapter error:", error);
    next(new ApiError(500, "Lỗi khi tải chương"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const chapterService = new ChapterService(MongoDB.client);
    const chapter = await chapterService.update(req.params.id, req.body);
    if (!chapter) {
      return next(new ApiError(404, "Không tìm thấy chương"));
    }
    res.send(chapter);
  } catch (error) {
    console.error("Update chapter error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật chương"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const chapterService = new ChapterService(MongoDB.client);
    const chapter = await chapterService.findById(req.params.id);

    if (!chapter) {
      return next(new ApiError(404, "Không tìm thấy chương"));
    }

    // Xóa file audio
    deleteChapterAudio(chapter.storyId.toString(), chapter.chapterNumber);

    // Xóa record trong database
    await chapterService.delete(req.params.id);

    // Cập nhật tổng lượt nghe của truyện sau khi xóa chương
    const storyService = new StoryService(MongoDB.client);
    await storyService.updateTotalListens(chapter.storyId.toString());

    // Sync stories để cập nhật số chương
    const allStories = await storyService.find({});
    await chatbotSync.syncStories(allStories);

    res.send({ message: "Xóa chương thành công" });
  } catch (error) {
    console.error("Delete chapter error:", error);
    next(new ApiError(500, "Lỗi khi xóa chương"));
  }
};
