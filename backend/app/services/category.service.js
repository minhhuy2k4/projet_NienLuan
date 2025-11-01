const { ObjectId } = require("mongodb");

class CategoryService {
  constructor(client) {
    this.Category = client.db().collection("categories");
  }

  /**
   * Hàm tạo slug từ tên thể loại (giống StoryService)
   */
  createSlug(text) {
    if (!text) return "";
    let slug = text.toLowerCase();
    slug = slug.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
    slug = slug.replace(/đ/gi, "d");
    slug = slug.replace(/[^a-z0-9\s-]/g, "");
    slug = slug.replace(/\s+/g, "-");
    slug = slug.replace(/^-+|-+$/g, "");
    slug = slug.replace(/-+/g, "-");
    return slug;
  }

  /**
   * Tạo unique slug (nếu trùng thì thêm số)
   */
  async generateUniqueSlug(name, excludeId = null) {
    let slug = this.createSlug(name);
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
      const filter = { slug: uniqueSlug };
      if (excludeId) {
        filter._id = { $ne: new ObjectId(excludeId) };
      }

      const existing = await this.Category.findOne(filter);
      if (!existing) break;

      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  extractCategoryData(payload) {
    const category = {
      name: payload.name,
    };
    if (payload.description) {
      category.description = payload.description;
    }
    if (payload.slug) {
      category.slug = payload.slug;
    }
    return category;
  }

  async create(payload) {
    const categoryData = this.extractCategoryData(payload);

    // Auto-generate slug nếu chưa có
    if (!categoryData.slug) {
      categoryData.slug = await this.generateUniqueSlug(categoryData.name);
    }

    categoryData.createdAt = new Date();
    categoryData.updatedAt = new Date();

    const result = await this.Category.insertOne(categoryData);
    return await this.Category.findOne({ _id: result.insertedId });
  }

  async find(filter = {}) {
    return await this.Category.find(filter).toArray();
  }

  async findById(id) {
    return await this.Category.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findBySlug(slug) {
    return await this.Category.findOne({ slug: slug });
  }

  async findByName(name) {
    return await this.Category.findOne({
      name: { $regex: name, $options: "i" },
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const updateData = this.extractCategoryData(payload);

    // Nếu tên thay đổi, tạo slug mới
    if (payload.name && !payload.slug) {
      updateData.slug = await this.generateUniqueSlug(payload.name, id);
    }

    updateData.updatedAt = new Date();

    const result = await this.Category.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Category.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result; // Sửa từ result.value thành result
  }

  // Thống kê số lượng truyện theo thể loại
  async getStoryCount(categoryId) {
    const stories = await this.Category.db().collection("stories");
    return await stories.countDocuments({
      categories: new ObjectId(categoryId),
    });
  }

  // Lấy các thể loại phổ biến nhất
  async getPopularCategories(limit = 10) {
    const pipeline = [
      {
        $lookup: {
          from: "stories",
          localField: "_id",
          foreignField: "categories",
          as: "stories",
        },
      },
      {
        $addFields: {
          storyCount: { $size: "$stories" },
        },
      },
      {
        $sort: { storyCount: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          description: 1,
          storyCount: 1,
        },
      },
    ];

    return await this.Category.aggregate(pipeline).toArray();
  }
}

module.exports = CategoryService;
