const AuthorService = require("../services/author.service");
const chatbotSync = require("../services/chatbot_services/chatbot-sync.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.fullName) {
    return next(new ApiError(400, "Tên tác giả là bắt buộc"));
  }
  try {
    const authorService = new AuthorService(MongoDB.client);
    const author = await authorService.create(req.body);
    // Sync authors
    const allAuthors = await authorService.find({});
    await chatbotSync.syncAuthors(allAuthors);

    res.status(201).send(author);
  } catch (error) {
    console.error("Create author error:", error);
    next(new ApiError(500, "Lỗi khi tạo tác giả"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const authors = await authorService.find();
    res.send(authors);
  } catch (error) {
    console.error("Find authors error:", error);
    next(new ApiError(500, "Lỗi khi tải danh sách tác giả"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const author = await authorService.findById(req.params.id);
    if (!author) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }
    res.send(author);
  } catch (error) {
    console.error("Find author error:", error);
    next(new ApiError(500, "Lỗi khi tải thông tin tác giả"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const author = await authorService.update(req.params.id, req.body);

    if (!author) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    // Sync authors
    const allAuthors = await authorService.find({});
    await chatbotSync.syncAuthors(allAuthors);

    res.send(author);
  } catch (error) {
    console.error("Update author error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật tác giả"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const authorId = req.params.id;

    // Kiểm tra author có tồn tại không
    const author = await authorService.findById(authorId);
    if (!author) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    // Kiểm tra có stories nào đang dùng author không
    const { ObjectId } = require("mongodb");
    const storiesCollection = MongoDB.client.db().collection("stories");

    // Field là "authors" (array)
    const storyCount = await storiesCollection.countDocuments({
      authors: new ObjectId(authorId),
    });

    if (storyCount > 0) {
      return next(
        new ApiError(
          400,
          `Không thể xóa tác giả "${author.fullName}" vì có ${storyCount} truyện đang sử dụng. Vui lòng xóa hoặc chuyển tác giả của các truyện trước.`
        )
      );
    }

    // Xóa author
    const result = await authorService.delete(authorId);

    // Sync tất cả authors vào file
    const allAuthors = await authorService.find({});
    await chatbotSync.syncAuthors(allAuthors);

    res.status(200).send({
      message: `Xóa tác giả "${author.fullName}" thành công`,
    });
  } catch (error) {
    console.error("Delete author error:", error);
    next(new ApiError(500, "Lỗi khi xóa tác giả: " + error.message));
  }
};
