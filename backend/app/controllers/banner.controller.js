const BannerService = require("../services/banner.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const {
  deleteBannerImage,
  getBannerImageUrl,
} = require("../middlewares/file-upload.middleware");

// Upload banner image
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const imageUrl = getBannerImageUrl(req, req.file.filename);
    res.json({
      message: "Upload thành công",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload banner error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi upload ảnh", error: error.message });
  }
};

// Lấy tất cả banners (có phân trang)
exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const bannerService = new BannerService(await MongoDB.client);
    const result = await bannerService.getAll(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error("Get all banners error:", error);
    next(new ApiError(500, "Lỗi khi lấy danh sách banner"));
  }
};

// Lấy chỉ banners đang active (cho frontend public)
exports.getActive = async (req, res, next) => {
  try {
    const bannerService = new BannerService(await MongoDB.client);
    const banners = await bannerService.getActive();
    res.json(banners);
  } catch (error) {
    console.error("Get active banners error:", error);
    next(new ApiError(500, "Lỗi khi lấy danh sách banner"));
  }
};

// Lấy banner theo ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bannerService = new BannerService(await MongoDB.client);
    const banner = await bannerService.getById(id);

    if (!banner) {
      return next(new ApiError(404, "Banner không tồn tại"));
    }

    res.json(banner);
  } catch (error) {
    console.error("Get banner by ID error:", error);
    next(new ApiError(500, "Lỗi khi lấy banner"));
  }
};

// Tạo banner mới
exports.create = async (req, res, next) => {
  try {
    const { title, subtitle, image, order, isActive } = req.body;

    if (!title || !subtitle || !image) {
      return next(new ApiError(400, "Thiếu thông tin bắt buộc"));
    }

    const bannerService = new BannerService(await MongoDB.client);
    const banner = await bannerService.create({
      title,
      subtitle,
      image,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error("Create banner error:", error);
    next(new ApiError(500, "Lỗi khi tạo banner"));
  }
};

// Cập nhật banner
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image, order, isActive } = req.body;

    const bannerService = new BannerService(await MongoDB.client);
    const banner = await bannerService.update(id, {
      title,
      subtitle,
      image,
      order,
      isActive,
    });

    if (!banner) {
      return next(new ApiError(404, "Banner không tồn tại"));
    }

    res.json(banner);
  } catch (error) {
    console.error("Update banner error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật banner"));
  }
};

// Xóa banner
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bannerService = new BannerService(await MongoDB.client);

    // Lấy thông tin banner trước khi xóa
    const banner = await bannerService.getById(id);
    if (!banner) {
      return next(new ApiError(404, "Banner không tồn tại"));
    }

    // Xóa file ảnh nếu là file upload (không phải URL external)
    if (banner.image && banner.image.startsWith("/banners/")) {
      const filename = banner.image.split("/").pop();
      try {
        deleteBannerImage(filename);
      } catch (error) {
        console.error("Error deleting banner file:", error);
        // Tiếp tục xóa record trong DB dù file không xóa được
      }
    }

    // Xóa banner trong database
    const deleted = await bannerService.delete(id);
    if (!deleted) {
      return next(new ApiError(404, "Banner không tồn tại"));
    }

    res.json({ message: "Đã xóa banner thành công" });
  } catch (error) {
    console.error("Delete banner error:", error);
    next(new ApiError(500, "Lỗi khi xóa banner"));
  }
};

// Toggle active status
exports.toggleActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bannerService = new BannerService(await MongoDB.client);
    const banner = await bannerService.toggleActive(id);

    if (!banner) {
      return next(new ApiError(404, "Banner không tồn tại"));
    }

    res.json(banner);
  } catch (error) {
    console.error("Toggle banner active error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật trạng thái banner"));
  }
};
