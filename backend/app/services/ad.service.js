const { ObjectId } = require("mongodb");

class AdService {
  constructor(client) {
    this.Ad = client.db().collection("ads");
  }

  // Lấy tất cả quảng cáo
  async getAll() {
    const ads = await this.Ad.find({}).sort({ order: 1 }).toArray();
    return ads;
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
    const ad = {
      title: adData.title,
      description: adData.description,
      image: adData.image,
      link: adData.link,
      position: adData.position, // 'home', 'story-detail', 'chapter-detail'
      order: adData.order || 0,
      isActive: adData.isActive !== undefined ? adData.isActive : true,
      clickCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.Ad.insertOne(ad);
    return { _id: result.insertedId, ...ad };
  }

  // Cập nhật quảng cáo
  async update(adId, adData) {
    const updateData = {
      updatedAt: new Date(),
    };

    if (adData.title !== undefined) updateData.title = adData.title;
    if (adData.description !== undefined)
      updateData.description = adData.description;
    if (adData.image !== undefined) updateData.image = adData.image;
    if (adData.link !== undefined) updateData.link = adData.link;
    if (adData.position !== undefined) updateData.position = adData.position;
    if (adData.order !== undefined) updateData.order = adData.order;
    if (adData.isActive !== undefined) updateData.isActive = adData.isActive;

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
