const { ObjectId } = require("mongodb");

class AdService {
  constructor(client) {
    this.Ad = client.db().collection("ads");
  }

  /**
   * Chuẩn hóa dữ liệu quảng cáo từ payload
   */
  extractAdData(payload) {
    const ad = {
      title: payload.title,
      description: payload.description,
      image: payload.image,
      link: payload.link,
      position: payload.position, // 'home', 'story-detail', 'chapter-detail'
      order: payload.order !== undefined ? payload.order : 0,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
    };

    // Xóa các trường undefined
    Object.keys(ad).forEach((key) => ad[key] === undefined && delete ad[key]);

    return ad;
  }

  // Lấy tất cả quảng cáo (có phân trang)
  async getAll(page = 1, limit = 5, search = "") {
    const skip = (page - 1) * limit;

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const ads = await this.Ad.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.Ad.countDocuments(query);

    return {
      ads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Lấy quảng cáo theo vị trí và đang active
  async getByPosition(position) {
    const ads = await this.Ad.find({
      position: position,
      isActive: true,
    })
      .sort({ order: 1 })
      .toArray();
    return ads;
  }

  // Lấy quảng cáo theo ID
  async getById(adId) {
    const ad = await this.Ad.findOne({
      _id: new ObjectId(adId),
    });
    return ad;
  }

  // Tạo quảng cáo mới
  async create(adData) {
    const ad = this.extractAdData(adData);
    ad.clickCount = 0;
    ad.viewCount = 0;
    ad.createdAt = new Date();
    ad.updatedAt = new Date();

    const result = await this.Ad.insertOne(ad);
    return { _id: result.insertedId, ...ad };
  }

  // Cập nhật quảng cáo
  async update(adId, adData) {
    const updateData = this.extractAdData(adData);
    updateData.updatedAt = new Date();

    const result = await this.Ad.findOneAndUpdate(
      { _id: new ObjectId(adId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result;
  }

  // Xóa quảng cáo
  async delete(adId) {
    const result = await this.Ad.deleteOne({
      _id: new ObjectId(adId),
    });
    return result.deletedCount > 0;
  }

  // Toggle active status
  async toggleActive(adId) {
    const ad = await this.getById(adId);
    if (!ad) {
      throw new Error("Quảng cáo không tồn tại");
    }

    const result = await this.Ad.findOneAndUpdate(
      { _id: new ObjectId(adId) },
      {
        $set: {
          isActive: !ad.isActive,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result;
  }

  // Tăng view count
  async incrementView(adId) {
    await this.Ad.updateOne(
      { _id: new ObjectId(adId) },
      { $inc: { viewCount: 1 } }
    );
  }

  // Tăng click count
  async incrementClick(adId) {
    await this.Ad.updateOne(
      { _id: new ObjectId(adId) },
      { $inc: { clickCount: 1 } }
    );
  }
}

module.exports = AdService;
