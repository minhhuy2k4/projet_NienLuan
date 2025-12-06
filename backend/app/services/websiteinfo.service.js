const fs = require("fs").promises;
const path = require("path");

class WebsiteInfoService {
  constructor() {
    this.filePath = path.join(
      __dirname,
      "..",
      "..",
      "chatbot_data",
      "website_info.txt"
    );
  }

  async ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      // File doesn't exist, create with default content
      await this.save({
        siteName: "",
        description: "",
        features: "",
        contact: "",
        policies: "",
        additionalInfo: "",
      });
    }
  }

  async get() {
    await this.ensureFile();
    const content = await fs.readFile(this.filePath, "utf8");

    // Parse the content back to object
    const data = {
      siteName: "",
      description: "",
      features: "",
      contact: "",
      policies: "",
      additionalInfo: "",
    };

    const lines = content.split("\n");
    let currentSection = "";

    for (const line of lines) {
      if (line.startsWith("=== TÊN TRANG WEB ===")) {
        currentSection = "siteName";
      } else if (line.startsWith("=== MÔ TẢ TRANG WEB ===")) {
        currentSection = "description";
      } else if (line.startsWith("=== TÍNH NĂNG CHÍNH ===")) {
        currentSection = "features";
      } else if (line.startsWith("=== THÔNG TIN LIÊN HỆ ===")) {
        currentSection = "contact";
      } else if (line.startsWith("=== CHÍNH SÁCH & QUY ĐỊNH ===")) {
        currentSection = "policies";
      } else if (line.startsWith("=== THÔNG TIN THÊM ===")) {
        currentSection = "additionalInfo";
      } else if (line.trim() && !line.startsWith("Cập nhật")) {
        if (currentSection) {
          data[currentSection] += line + "\n";
        }
      }
    }

    // Trim all fields
    Object.keys(data).forEach((key) => {
      data[key] = data[key].trim();
    });

    return data;
  }

  async save(data) {
    let content = "=== TÊN TRANG WEB ===\n";
    content += `${data.siteName || ""}\n\n`;

    content += "=== MÔ TẢ TRANG WEB ===\n";
    content += `${data.description || ""}\n\n`;

    content += "=== TÍNH NĂNG CHÍNH ===\n";
    content += `${data.features || ""}\n\n`;

    content += "=== THÔNG TIN LIÊN HỆ ===\n";
    content += `${data.contact || ""}\n\n`;

    content += "=== CHÍNH SÁCH & QUY ĐỊNH ===\n";
    content += `${data.policies || ""}\n\n`;

    content += "=== THÔNG TIN THÊM ===\n";
    content += `${data.additionalInfo || ""}\n\n`;

    content += `Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}\n`;

    await fs.writeFile(this.filePath, content, "utf8");

    return data;
  }
}

module.exports = new WebsiteInfoService();
