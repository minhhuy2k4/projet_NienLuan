const fs = require("fs").promises;
const path = require("path");

class ChatbotSyncService {
  constructor() {
    this.dataDir = path.join(__dirname, "..", "..", "..", "chatbot_data");
  }

  async ensureDataDir() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  async syncCategories(categories) {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, "categories.txt");

    let content = "=== DANH SÁCH THỂ LOẠI TRUYỆN ===\n\n";

    categories.forEach((cat, index) => {
      content += `${index + 1}. ${cat.name}\n`;
      if (cat.description) {
        content += `   Mô tả: ${cat.description}\n`;
      }
      content += "\n";
    });

    content += `\nTổng số thể loại: ${categories.length}\n`;
    content += `Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}\n`;

    await fs.writeFile(filePath, content, "utf8");
    console.log("✅ Đã sync categories vào chatbot_data/categories.txt");
  }

  async syncAuthors(authors) {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, "authors.txt");

    let content = "=== DANH SÁCH TÁC GIẢ ===\n\n";

    authors.forEach((author, index) => {
      content += `${index + 1}. ${author.fullName}\n`;
      if (author.email) {
        content += `   Email: ${author.email}\n`;
      }
      if (author.bio) {
        content += `   Tiểu sử: ${author.bio}\n`;
      }
      content += "\n";
    });

    content += `\nTổng số tác giả: ${authors.length}\n`;
    content += `Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}\n`;

    await fs.writeFile(filePath, content, "utf8");
    console.log("✅ Đã sync authors vào chatbot_data/authors.txt");
  }

  async syncStories(stories) {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, "stories.txt");

    let content = "=== DANH SÁCH TRUYỆN ===\n\n";

    for (const story of stories) {
      content += `📖 ${story.name}\n`;
      content += `   ID: ${story._id}\n`;

      // Hiển thị tác giả (có thể có nhiều tác giả)
      if (story.authorDetails && story.authorDetails.length > 0) {
        const authorNames = story.authorDetails
          .map((author) => author.name || author.fullName)
          .join(", ");
        content += `   Tác giả: ${authorNames}\n`;
      }

      // Hiển thị thể loại (có thể có nhiều thể loại)
      if (story.categoryDetails && story.categoryDetails.length > 0) {
        const categoryNames = story.categoryDetails
          .map((cat) => cat.name)
          .join(", ");
        content += `   Thể loại: ${categoryNames}\n`;
      }

      if (story.description) {
        content += `   Mô tả: ${story.description.substring(0, 200)}${story.description.length > 200 ? "..." : ""}\n`;
      }

      // Hiển thị số chương chính xác từ chapterCount
      content += `   Số chương: ${story.chapterCount || 0}\n`;
      content += `   Lượt xem: ${story.views || 0}\n`;
      content += `   Trạng thái: ${story.status || "Đang tiến hành"}\n`;

      // Hiển thị ngày đăng truyện
      if (story.createdAt) {
        const createdDate = new Date(story.createdAt);
        content += `   Ngày đăng: ${createdDate.toLocaleString("vi-VN")}\n`;
      }

      // Hiển thị ngày cập nhật
      if (story.updatedAt) {
        const updatedDate = new Date(story.updatedAt);
        content += `   Cập nhật lần cuối: ${updatedDate.toLocaleString("vi-VN")}\n`;
      }

      content += "\n";
    }

    content += `\nTổng số truyện: ${stories.length}\n`;
    content += `Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}\n`;

    await fs.writeFile(filePath, content, "utf8");
    console.log("✅ Đã sync stories vào chatbot_data/stories.txt");
  }

  // async syncChapters(storyId, storyName, chapters) {
  //   await this.ensureDataDir();
  //   const filePath = path.join(this.dataDir, `chapters_${storyId}.txt`);

  //   let content = `=== DANH SÁCH CHƯƠNG: ${storyName} ===\n\n`;

  //   chapters.forEach((chapter) => {
  //     content += `Chương ${chapter.chapterNumber}: ${chapter.title}\n`;
  //     if (chapter.content) {
  //       content += `   Nội dung: ${chapter.content.substring(0, 150)}${chapter.content.length > 150 ? "..." : ""}\n`;
  //     }
  //     content += `   Lượt xem: ${chapter.views || 0}\n`;
  //     if (chapter.audioUrl) {
  //       content += `   Có audio: Có\n`;
  //     }
  //     content += "\n";
  //   });

  //   content += `\nTổng số chương: ${chapters.length}\n`;
  //   content += `Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}\n`;

  //   await fs.writeFile(filePath, content, "utf8");
  //   console.log(`✅ Đã sync chapters cho truyện ${storyName}`);
  // }

  // async deleteChaptersFile(storyId) {
  //   const filePath = path.join(this.dataDir, `chapters_${storyId}.txt`);
  //   try {
  //     await fs.unlink(filePath);
  //     console.log(`✅ Đã xóa file chapters_${storyId}.txt`);
  //   } catch (error) {
  //     // File không tồn tại, bỏ qua
  //   }
  // }
}

module.exports = new ChatbotSyncService();
