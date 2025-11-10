const AdService = require("../services/ad.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const {
  deleteAdImage,
  getAdImageUrl,
} = require("../middlewares/file-upload.middleware");

// Upload ad image
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const imageUrl = getAdImageUrl(req, req.file.filename);
    res.json({
      message: "Upload thành công",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload ad error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi upload ảnh", error: error.message });
  }
};

// Lấy tất cả quảng cáo
exports.getAll = async (req, res, next) => {
  try {
    const adService = new AdService(await MongoDB.client);
    const ads = await adService.getAll();
    res.json(ads);
  } catch (error) {
    console.error("Get all ads error:", error);
    next(new ApiError(500, "Lỗi khi lấy danh sách quảng cáo"));
  }
};

// Lấy quảng cáo theo vị trí (cho frontend public)
exports.getByPosition = async (req, res, next) => {
  try {
    const { position } = req.params;
    const adService = new AdService(await MongoDB.client);
    const ads = await adService.getByPosition(position);
    res.json(ads);
  } catch (error) {
    console.error("Get ads by position error:", error);
    next(new ApiError(500, "Lỗi khi lấy danh sách quảng cáo"));
  }
};

// Lấy quảng cáo theo ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adService = new AdService(await MongoDB.client);
    const ad = await adService.getById(id);

    if (!ad) {
      return next(new ApiError(404, "Quảng cáo không tồn tại"));
    }

    res.json(ad);
  } catch (error) {
    console.error("Get ad by ID error:", error);
    next(new ApiError(500, "Lỗi khi lấy quảng cáo"));
  }
};

// Tạo quảng cáo mới
exports.create = async (req, res, next) => {
  try {
    const { title, description, image, link, position, order, isActive } =
      req.body;

    if (!title || !image || !link || !position) {
      return next(new ApiError(400, "Thiếu thông tin bắt buộc"));
    }

    const adService = new AdService(await MongoDB.client);
    const ad = await adService.create({
      title,
      description,
      image,
      link,
      position,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error("Create ad error:", error);
    next(new ApiError(500, "Lỗi khi tạo quảng cáo"));
  }
};

// Cập nhật quảng cáo
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image, link, position, order, isActive } =
      req.body;

    const adService = new AdService(await MongoDB.client);
    const ad = await adService.update(id, {
      title,
      description,
      image,
      link,
      position,
      order,
      isActive,
    });

    if (!ad) {
      return next(new ApiError(404, "Quảng cáo không tồn tại"));
    }

    res.json(ad);
  } catch (error) {
    console.error("Update ad error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật quảng cáo"));
  }
};

// Xóa quảng cáo
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adService = new AdService(await MongoDB.client);

    // Lấy thông tin quảng cáo trước khi xóa
    const ad = await adService.getById(id);
    if (!ad) {
      return next(new ApiError(404, "Quảng cáo không tồn tại"));
    }

    // Xóa file ảnh nếu là file upload
    if (ad.image && ad.image.startsWith("/ads/")) {
      const filename = ad.image.split("/").pop();
      try {
        deleteAdImage(filename);
      } catch (error) {
        console.error("Error deleting ad image:", error);
      }
    }

    const deleted = await adService.delete(id);
    if (!deleted) {
      return next(new ApiError(404, "Quảng cáo không tồn tại"));
    }

    res.json({ message: "Đã xóa quảng cáo thành công" });
  } catch (error) {
    console.error("Delete ad error:", error);
    next(new ApiError(500, "Lỗi khi xóa quảng cáo"));
  }
};

// Toggle active status
exports.toggleActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adService = new AdService(await MongoDB.client);
    const ad = await adService.toggleActive(id);

    if (!ad) {
      return next(new ApiError(404, "Quảng cáo không tồn tại"));
    }

    res.json(ad);
  } catch (error) {
    console.error("Toggle ad active error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật trạng thái quảng cáo"));
  }
};

// Track view
exports.trackView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adService = new AdService(await MongoDB.client);
    await adService.incrementView(id);
    res.json({ message: "Tracked view" });
  } catch (error) {
    console.error("Track view error:", error);
    // Không trả lỗi để không ảnh hưởng UX
    res.json({ message: "OK" });
  }
};

// Track click
exports.trackClick = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adService = new AdService(await MongoDB.client);
    await adService.incrementClick(id);
    res.json({ message: "Tracked click" });
  } catch (error) {
    console.error("Track click error:", error);
    res.json({ message: "OK" });
  }
};
