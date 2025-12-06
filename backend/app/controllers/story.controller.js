const StoryService = require("../services/story.service");
const ChapterService = require("../services/chapter.service");
const chatbotSync = require("../services/chatbot_services/chatbot-sync.service");
const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");
const {
  getFileUrl,
  deleteStoryFiles,
} = require("../middlewares/file-upload.middleware");

// --- Story CRUD ---

exports.create = async (req, res, next) => {
  if (!req.body?.name) return next(new ApiError(400, "Tên truyện là bắt buộc"));
  try {
    const storyService = new StoryService(MongoDB.client);
    const story = await storyService.create(req.body);

    // Sync tất cả stories (populate author và category)
    const allStories = await storyService.find({});
    await chatbotSync.syncStories(allStories);

    res.status(201).send(story);
  } catch (error) {
    console.error("Create story error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi tạo truyện", error: error.message });
  }
};

exports.uploadCover = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const storyService = new StoryService(MongoDB.client);

    // Kiểm tra story có tồn tại không
    const story = await storyService.findById(storyId);
    if (!story) {
      return res.status(404).send({ message: "Không tìm thấy truyện" });
    }

    // Tạo URL cho ảnh bìa
    const coverUrl = getFileUrl(req, storyId, req.file.filename);

    // Cập nhật chỉ URL ảnh bìa vào database (không spread toàn bộ story)
    const updatedStory = await storyService.update(storyId, {
      image: coverUrl,
    });

    res.send({
      message: "Upload ảnh bìa thành công",
      imageUrl: coverUrl,
      story: updatedStory,
    });
  } catch (error) {
    console.error("Upload cover error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi upload ảnh bìa", error: error.message });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const storyService = new StoryService(MongoDB.client);
    const stories = await storyService.find();
    res.send(stories);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Lỗi khi lấy danh sách truyện", error: error.message });
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q, category, author } = req.query;

    const storyService = new StoryService(MongoDB.client);
    const stories = await storyService.search(q, category, author);

    res.send({
      total: stories.length,
      query: { q, category, author },
      results: stories,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi tìm kiếm truyện", error: error.message });
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const storyService = new StoryService(MongoDB.client);
    const story = await storyService.findById(req.params.id);
    if (!story)
      return res.status(404).send({ message: "Không tìm thấy truyện" });

    // Tăng view count
    await storyService.incrementViews(req.params.id);

    res.send(story);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Lỗi khi lấy truyện", error: error.message });
  }
};

exports.findBySlug = async (req, res, next) => {
  try {
    const storyService = new StoryService(MongoDB.client);
    const story = await storyService.findBySlug(req.params.slug);
    if (!story)
      return res.status(404).send({ message: "Không tìm thấy truyện" });

    // Tăng view count
    await storyService.incrementViews(story._id.toString());

    res.send(story);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Lỗi khi lấy truyện theo slug", error: error.message });
  }
};

exports.update = async (req, res, next) => {
  try {
    const storyService = new StoryService(MongoDB.client);
    const story = await storyService.update(req.params.id, req.body);
    if (!story)
      return res.status(404).send({ message: "Không tìm thấy truyện" });

    // Sync stories
    const allStories = await storyService.find({});
    await chatbotSync.syncStories(allStories);

    res.send({ message: "Cập nhật thành công", story });
  } catch (error) {
    console.error("Update story error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi cập nhật truyện", error: error.message });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const storyId = req.params.id; // Thêm dòng này
    const storyService = new StoryService(MongoDB.client);
    const chapterService = new ChapterService(MongoDB.client);

    // Kiểm tra story có tồn tại TRƯỚC KHI XÓA
    const existingStory = await storyService.findById(storyId);

    if (!existingStory) {
      return res.status(404).send({ message: "Không tìm thấy truyện" });
    }

    // Xóa story từ database
    await storyService.delete(storyId);

    // Xóa tất cả chapters của truyện
    const chaptersResult = await chapterService.deleteByStoryId(storyId);

    // Xóa toàn bộ thư mục files của truyện
    try {
      deleteStoryFiles(storyId);
    } catch (fileError) {
      // Không throw lỗi, vì đã xóa database thành công
    }

    // Sync lại danh sách stories
    const allStories = await storyService.find({});
    await chatbotSync.syncStories(allStories);

    res.status(200).send({ message: "Xóa truyện thành công" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Lỗi khi xóa truyện", error: error.message });
  }
};

// --- Lấy truyện theo loại với phân trang ---

exports.getNewStories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    const storyService = new StoryService(MongoDB.client);
    const result = await storyService.getNewStories(page, limit);

    res.send(result);
  } catch (error) {
    console.error("Get new stories error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi lấy truyện mới", error: error.message });
  }
};

exports.getFullStories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    const storyService = new StoryService(MongoDB.client);
    const result = await storyService.getFullStories(page, limit);

    res.send(result);
  } catch (error) {
    console.error("Get full stories error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi lấy truyện full", error: error.message });
  }
};

exports.getHotStories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    const storyService = new StoryService(MongoDB.client);
    const result = await storyService.getHotStories(page, limit);

    res.send(result);
  } catch (error) {
    console.error("Get hot stories error:", error);
    return res
      .status(500)
      .send({ message: "Lỗi khi lấy truyện hot", error: error.message });
  }
};
