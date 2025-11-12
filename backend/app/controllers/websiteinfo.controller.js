const WebsiteInfoService = require("../services/websiteinfo.service");
const ApiError = require("../api-error");

exports.get = async (req, res, next) => {
  try {
    const data = await WebsiteInfoService.get();
    res.send(data);
  } catch (error) {
    console.error("Get website info error:", error);
    next(new ApiError(500, "Lỗi khi tải thông tin website"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await WebsiteInfoService.save(req.body);
    res.send(data);
  } catch (error) {
    console.error("Update website info error:", error);
    next(new ApiError(500, "Lỗi khi cập nhật thông tin website"));
  }
};
