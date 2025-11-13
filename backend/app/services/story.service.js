const { ObjectId } = require("mongodb");

class StoryService {
  constructor(client) {
    this.Story = client.db().collection("stories");
  }

  /**
   * Hàm tạo slug từ tên truyện (giống frontend)
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

    // Kiểm tra slug đã tồn tại chưa
    while (true) {
      const filter = { slug: uniqueSlug };
      if (excludeId) {
        filter._id = { $ne: new ObjectId(excludeId) };
      }

      const existing = await this.Story.findOne(filter);
      if (!existing) break;

      // Nếu trùng, thêm số vào cuối
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  /**
   * Chuẩn hóa dữ liệu truyện từ payload
   */
  extractStoryData(payload) {
    const story = {
      name: payload.name,
      slug: payload.slug, // Slug sẽ được generate riêng trong create/update
      description: payload.description,
      image: payload.image,
      // Chuyển đổi mảng ID string (nếu có) thành mảng ObjectId
      authors: Array.isArray(payload.authors)
        ? payload.authors.map((id) => new ObjectId(id))
        : [],
      categories: Array.isArray(payload.categories)
        ? payload.categories.map((id) => new ObjectId(id))
        : [],
      status: payload.status || "đang tiến hành",
      // Khởi tạo các giá trị mặc định (bỏ chapters vì đã có collection riêng)
      views: 0,
      favoritesCount: 0,
      averageRating: 0,
      totalRatings: 0,
    };
    // Xóa các trường undefined
    Object.keys(story).forEach(
      (key) => story[key] === undefined && delete story[key]
    );
    return story;
  }

  /**
   * Tạo một truyện mới
   */
  async create(payload) {
    const storyData = this.extractStoryData(payload);

    // Tạo unique slug
    storyData.slug = await this.generateUniqueSlug(storyData.name);

    // Thêm timestamps khi tạo mới
    storyData.createdAt = new Date();
    storyData.updatedAt = new Date();
    const result = await this.Story.insertOne(storyData);
    return await this.findById(result.insertedId);
  }

  /**
   * Lấy tất cả truyện (sử dụng findWithChapterCount)
   */
  async find(filter = {}) {
    return await this.findWithChapterCount(filter);
  }

  /**
   * Lấy 1 truyện bằng ID (bao gồm thông tin chi tiết của tác giả, thể loại và chapters)
   */
  async findById(id) {
    const result = await this.Story.aggregate([
      // Tìm truyện khớp với ID
      { $match: { _id: ObjectId.isValid(id) ? new ObjectId(id) : null } },
      // "Join" với collection 'authors'
      {
        $lookup: {
          from: "authors",
          localField: "authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      // "Join" với collection 'categories'
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      // "Join" với collection 'chapters'
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "storyId",
          as: "chapters",
          pipeline: [
            { $sort: { chapterNumber: 1 } }, // Sort chapters by number
          ],
        },
      },
      // Thêm thống kê
      {
        $addFields: {
          chapterCount: { $size: "$chapters" },
          totalViews: { $sum: "$chapters.views" },
        },
      },
    ]).next(); // .next() vì findById chỉ trả về 1 document

    return result;
  }

  /**
   * Lấy truyện bằng slug (query trực tiếp từ DB - tối ưu hơn)
   */
  async findBySlug(slug) {
    const result = await this.Story.aggregate([
      { $match: { slug: slug } },
      {
        $lookup: {
          from: "authors",
          localField: "authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "storyId",
          as: "chapters",
          pipeline: [{ $sort: { chapterNumber: 1 } }],
        },
      },
      {
        $addFields: {
          chapterCount: { $size: "$chapters" },
          totalViews: { $sum: "$chapters.views" },
        },
      },
    ]).next();

    return result;
  }

  /**
   * Lấy tất cả truyện với thông tin cơ bản và số chapter
   */
  async findWithChapterCount(filter = {}) {
    return await this.Story.aggregate([
      { $match: filter },
      // Join với authors
      {
        $lookup: {
          from: "authors",
          localField: "authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      // Join với categories
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      // Join với chapters để đếm
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "storyId",
          as: "chapters",
        },
      },
      // Thêm thống kê
      {
        $addFields: {
          chapterCount: { $size: "$chapters" },
          totalViews: { $sum: "$chapters.views" },
          latestChapter: {
            $max: "$chapters.chapterNumber",
          },
        },
      },
      // Loại bỏ chapters array để giảm dung lượng
      {
        $project: {
          chapters: 0,
        },
      },
    ]).toArray();
  }

  /**
   * Cập nhật thông tin cơ bản của truyện
   */
  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };

    // Tạo object update data
    const updateData = {
      updatedAt: new Date(),
    };

    // Chỉ update các field nếu có trong payload
    if (payload.name !== undefined) {
      updateData.name = payload.name;
      // Tự động tạo slug mới khi đổi tên
      updateData.slug = await this.generateUniqueSlug(payload.name, id);
    }
    if (payload.description !== undefined) {
      updateData.description = payload.description;
    }
    if (payload.image !== undefined) {
      updateData.image = payload.image;
    }
    if (payload.authors !== undefined && Array.isArray(payload.authors)) {
      updateData.authors = payload.authors.map((id) => new ObjectId(id));
    }
    if (payload.categories !== undefined && Array.isArray(payload.categories)) {
      updateData.categories = payload.categories.map((id) => new ObjectId(id));
    }
    if (payload.status !== undefined) {
      updateData.status = payload.status;
    }

    return await this.Story.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );
  }

  /**
   * Xóa 1 truyện
   */
  async delete(id) {
    console.log("StoryService.delete - Input ID:", id);
    console.log("ObjectId.isValid:", ObjectId.isValid(id));
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
    console.log("Converted ObjectId:", objectId);

    // Kiểm tra xem story có tồn tại không
    const existingStory = await this.Story.findOne({ _id: objectId });
    console.log(
      "Existing story before delete:",
      existingStory ? "found" : "not found"
    );

    const result = await this.Story.findOneAndDelete({
      _id: objectId,
    });
    console.log("Delete result:", result);
    return result.value;
  }

  /**
   * Tăng lượt xem truyện
   */
  async incrementViews(id) {
    await this.Story.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );
  }

  /**
   * Tìm kiếm truyện theo tên, tác giả, thể loại
   */
  async search(query, categoryId, authorId) {
    const filter = {};

    // Tìm kiếm theo tên (case-insensitive)
    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    // Lọc theo category
    if (categoryId) {
      filter.categories = new ObjectId(categoryId);
    }

    // Lọc theo author
    if (authorId) {
      filter.authors = new ObjectId(authorId);
    }

    return await this.findWithChapterCount(filter);
  }
}

module.exports = StoryService;
