const { ObjectId } = require("mongodb");

class ChapterService {
  constructor(client) {
    this.Chapter = client.db().collection("chapters");
  }

  extractChapterData(payload, isUpdate = false) {
    const chapter = {
      title: payload.title,
      content: payload.content || "",
      chapterNumber: payload.chapterNumber
        ? parseInt(payload.chapterNumber)
        : undefined,
      duration: payload.duration || 0, // Thời lượng audio (giây)
      audioUrl: payload.audioUrl || null, // Link file audio
      isPublished:
        payload.isPublished !== undefined ? payload.isPublished : true,
    };

    // Chỉ thêm storyId khi create, không update storyId
    if (!isUpdate && payload.storyId) {
      chapter.storyId = new ObjectId(payload.storyId);
    }

    // Xóa các field undefined
    Object.keys(chapter).forEach(
      (key) => chapter[key] === undefined && delete chapter[key]
    );

    return chapter;
  }

  async create(payload) {
    const chapterData = this.extractChapterData(payload);
    chapterData.createdAt = new Date();
    chapterData.updatedAt = new Date();
    chapterData.views = 0; // Số lượt xem

    const result = await this.Chapter.insertOne(chapterData);
    return await this.Chapter.findOne({ _id: result.insertedId });
  }

  async findByStoryId(storyId) {
    return await this.Chapter.find({
      storyId: new ObjectId(storyId),
    })
      .sort({ chapterNumber: 1 })
      .toArray();
  }

  async findById(id) {
    return await this.Chapter.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByStoryAndChapter(storyId, chapterNumber) {
    return await this.Chapter.findOne({
      storyId: new ObjectId(storyId),
      chapterNumber: parseInt(chapterNumber),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const updateData = this.extractChapterData(payload, true); // true = isUpdate
    updateData.updatedAt = new Date();

    const result = await this.Chapter.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );

    // MongoDB driver mới trả về document trực tiếp, không phải result.value
    return result;
  }

  async delete(id) {
    const result = await this.Chapter.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteByStoryId(storyId) {
    return await this.Chapter.deleteMany({
      storyId: new ObjectId(storyId),
    });
  }

  async getChapterCount(storyId) {
    return await this.Chapter.countDocuments({
      storyId: new ObjectId(storyId),
    });
  }

  async incrementViews(id) {
    await this.Chapter.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );
  }

  async getNextChapterNumber(storyId) {
    const lastChapter = await this.Chapter.findOne(
      { storyId: new ObjectId(storyId) },
      { sort: { chapterNumber: -1 } }
    );
    return lastChapter ? lastChapter.chapterNumber + 1 : 1;
  }
}

module.exports = ChapterService;
