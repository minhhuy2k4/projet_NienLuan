const { ObjectId } = require("mongodb");

class AuthorService {
  constructor(client) {
    this.Author = client.db().collection("authors");
  }

  extractAuthorData(payload) {
    const author = {
      fullName: payload.fullName,
    };
    if (payload.bio) {
      author.bio = payload.bio;
    }
    if (payload.email) {
      author.email = payload.email;
    }
    // Avatar đã bị loại bỏ
    return author;
  }

  async create(payload) {
    const author = this.extractAuthorData(payload);
    author.createdAt = new Date();
    const result = await this.Author.insertOne(author);
    return this.Author.findOne({ _id: result.insertedId });
  }

  async find() {
    return await this.Author.find({}).toArray();
  }

  async findById(id) {
    return await this.Author.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractAuthorData(payload);
    update.updatedAt = new Date();

    const result = await this.Author.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Author.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}

module.exports = AuthorService;
