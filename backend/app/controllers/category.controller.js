const CategoryService = require("../services/category.service");
const chatbotSync = require("../services/chatbot_services/chatbot-sync.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên thể loại là bắt buộc"));
  }
  try {
    console.log("Create category request:", req.body);
    const categoryService = new CategoryService(MongoDB.client);
    const category = await categoryService.create(req.body);

    // Sync tất cả categories vào file
    const allCategories = await categoryService.find({});
    await chatbotSync.syncCategories(allCategories);

    res.status(201).send(category);
  } catch (error) {
    console.error("Create category error:", error);
    next(new ApiError(500, "Lỗi khi tạo thể loại: " + error.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    console.log("Get all categories request");
    const categoryService = new CategoryService(MongoDB.client);
    const categories = await categoryService.find();
    console.log("Categories found:", categories.length);
    res.send(categories);
  } catch (error) {
    console.error("Find categories error:", error);
    next(new ApiError(500, "Lỗi khi tải danh sách thể loại: " + error.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const category = await categoryService.findById(req.params.id);
    if (!category) {
      return next(new ApiError(404, "Không tìm thấy thể loại"));
    }
    res.send(category);
  } catch (error) {
    console.error("Find category error:", error);
    next(new ApiError(500, "Lỗi khi tải thông tin thể loại: " + error.message));
  }
};

exports.findBySlug = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const category = await categoryService.findBySlug(req.params.slug);
    if (!category) {
      return next(new ApiError(404, "Không tìm thấy thể loại"));
    }
    res.send(category);
  } catch (error) {
    console.error("Find category by slug error:", error);
    next(new ApiError(500, "Lỗi khi tải thông tin thể loại: " + error.message));
  }
};

exports.update = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên thể loại là bắt buộc"));
  }
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const category = await categoryService.update(req.params.id, req.body);
    if (!category) {
      return next(new ApiError(404, "Không tìm thấy thể loại"));
    }
    // Sync tất cả categories vào file
    const allCategories = await categoryService.find({});
    await chatbotSync.syncCategories(allCategories);
    res.send(category);
  } catch (error) {
    console.error("Update category error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật thể loại: " + error.message));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const categoryId = req.params.id;

    // Kiểm tra category có tồn tại không
    const category = await categoryService.findById(categoryId);
    if (!category) {
      return next(new ApiError(404, "Không tìm thấy thể loại"));
    }

    // Kiểm tra có stories nào đang dùng category không
    const { ObjectId } = require("mongodb");
    const storiesCollection = MongoDB.client.db().collection("stories");

    // Sửa: Field là "categories" (array), không phải "categoryId"
    const storyCount = await storiesCollection.countDocuments({
      categories: new ObjectId(categoryId),
    });

    if (storyCount > 0) {
      return next(
        new ApiError(
          400,
          `Không thể xóa thể loại "${category.name}" vì có ${storyCount} truyện đang sử dụng. Vui lòng xóa hoặc chuyển thể loại của các truyện trước.`
        )
      );
    }

    // Xóa category
    const result = await categoryService.delete(categoryId);

    // Sync tất cả categories vào file
    const allCategories = await categoryService.find({});
    await chatbotSync.syncCategories(allCategories);

    res.status(200).send({
      message: `Xóa thể loại "${category.name}" thành công`,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    next(new ApiError(500, "Lỗi khi xóa thể loại: " + error.message));
  }
};

// Endpoint để lấy thống kê
exports.getPopular = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const limit = parseInt(req.query.limit) || 10;
    const categories = await categoryService.getPopularCategories(limit);
    res.send(categories);
  } catch (error) {
    console.error("Get popular categories error:", error);
    next(new ApiError(500, "Lỗi khi tải thể loại phổ biến: " + error.message));
  }
};
