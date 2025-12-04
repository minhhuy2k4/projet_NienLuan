const { ObjectId } = require("mongodb");

class ChapterService {
  constructor(client) {
    this.Chapter = client.db().collection("chapters");
  }

  extractChapterData(payload, isUpdate = false) {
    const chapter = {};

    // Chỉ thêm các field nếu chúng tồn tại trong payload
    if (payload.title !== undefined) chapter.title = payload.title;
    if (payload.content !== undefined) chapter.content = payload.content;
    if (payload.description !== undefined)
      chapter.description = payload.description;
    if (payload.chapterNumber !== undefined)
      chapter.chapterNumber = parseInt(payload.chapterNumber);
    if (payload.duration !== undefined)
      chapter.duration = payload.duration || 0;
    if (payload.audioUrl !== undefined) chapter.audioUrl = payload.audioUrl;
    if (payload.isPublished !== undefined)
      chapter.isPublished = payload.isPublished;

    // Chỉ thêm storyId khi create, không update storyId
    if (!isUpdate && payload.storyId) {
      chapter.storyId = new ObjectId(payload.storyId);
    }

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

    // Chỉ cập nhật nếu có dữ liệu
    if (Object.keys(updateData).length === 0) {
      return await this.findById(id);
    }

    updateData.updatedAt = new Date();

    const result = await this.Chapter.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );

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
