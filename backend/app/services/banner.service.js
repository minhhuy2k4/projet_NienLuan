const { ObjectId } = require("mongodb");

class BannerService {
  constructor(client) {
    this.Banner = client.db().collection("banners");
  }

  /**
   * Chuẩn hóa dữ liệu banner từ payload
   */
  extractBannerData(payload) {
    const banner = {
      title: payload.title,
      subtitle: payload.subtitle,
      image: payload.image,
      order: payload.order !== undefined ? payload.order : 0,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
    };

    // Xóa các trường undefined
    Object.keys(banner).forEach(
      (key) => banner[key] === undefined && delete banner[key]
    );

    return banner;
  }

  // Lấy tất cả banners (có phân trang)
  async getAll(page = 1, limit = 5, search = "") {
    const skip = (page - 1) * limit;

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
      ];
    }

    const banners = await this.Banner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.Banner.countDocuments(query);

    return {
      banners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Lấy chỉ banners đang active
  async getActive() {
    const banners = await this.Banner.find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    return banners;
  }

  // Lấy banner theo ID
  async getById(bannerId) {
    const banner = await this.Banner.findOne({
      _id: new ObjectId(bannerId),
    });
    return banner;
  }

  // Tạo banner mới
  async create(bannerData) {
    const banner = this.extractBannerData(bannerData);
    banner.createdAt = new Date();
    banner.updatedAt = new Date();

    const result = await this.Banner.insertOne(banner);
    return { _id: result.insertedId, ...banner };
  }

  // Cập nhật banner
  async update(bannerId, bannerData) {
    const updateData = this.extractBannerData(bannerData);
    updateData.updatedAt = new Date();

    const result = await this.Banner.findOneAndUpdate(
      { _id: new ObjectId(bannerId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result;
  }

  // Xóa banner
  async delete(bannerId) {
    const result = await this.Banner.deleteOne({
      _id: new ObjectId(bannerId),
    });
    return result.deletedCount > 0;
  }

  // Toggle active status
  async toggleActive(bannerId) {
    const banner = await this.getById(bannerId);
    if (!banner) {
      throw new Error("Banner không tồn tại");
    }

    const result = await this.Banner.findOneAndUpdate(
      { _id: new ObjectId(bannerId) },
      {
        $set: {
          isActive: !banner.isActive,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result;
  }
}

module.exports = BannerService;
