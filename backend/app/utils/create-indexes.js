const MongoDB = require("./mongodb.util");

/**
 * Tạo indexes cho các collection để tăng tốc độ truy vấn
 */
async function createIndexes() {
  try {
    console.log("🔍 Bắt đầu tạo indexes...");

    const db = MongoDB.client.db();

    // ==================== STORIES COLLECTION ====================
    console.log("\n📚 Tạo indexes cho collection 'stories'...");

    // Index cho tìm kiếm theo tên truyện (text search)
    await db
      .collection("stories")
      .createIndex(
        { name: "text", description: "text" },
        { name: "story_text_search" }
      );
    console.log("✅ Index text search: name, description");

    // Index cho filter theo authors
    await db
      .collection("stories")
      .createIndex({ authors: 1 }, { name: "story_authors_index" });
    console.log("✅ Index: authors");

    // Index cho filter theo categories
    await db
      .collection("stories")
      .createIndex({ categories: 1 }, { name: "story_categories_index" });
    console.log("✅ Index: categories");

    // Index cho slug (SEO-friendly URLs) - UNIQUE
    await db
      .collection("stories")
      .createIndex(
        { slug: 1 },
        { unique: true, sparse: true, name: "slug_unique_index" }
      );
    console.log("✅ Index: slug (unique)");

    // Index cho sắp xếp theo views (truyện hot)
    await db
      .collection("stories")
      .createIndex({ views: -1 }, { name: "story_views_index" });
    console.log("✅ Index: views (descending)");

    // Index cho sắp xếp theo updatedAt (truyện mới cập nhật)
    await db
      .collection("stories")
      .createIndex({ updatedAt: -1 }, { name: "story_updated_index" });
    console.log("✅ Index: updatedAt (descending)");

    // Index compound cho filter + sort
    await db
      .collection("stories")
      .createIndex(
        { categories: 1, updatedAt: -1 },
        { name: "story_category_updated_index" }
      );
    console.log("✅ Index compound: categories + updatedAt");

    // ==================== CHAPTERS COLLECTION ====================
    console.log("\n📖 Tạo indexes cho collection 'chapters'...");

    // Index cho query chapters theo storyId
    await db
      .collection("chapters")
      .createIndex(
        { storyId: 1, chapterNumber: 1 },
        { name: "chapter_story_number_index" }
      );
    console.log("✅ Index compound: storyId + chapterNumber");

    // Index cho sắp xếp chapters
    await db
      .collection("chapters")
      .createIndex(
        { storyId: 1, createdAt: -1 },
        { name: "chapter_story_created_index" }
      );
    console.log("✅ Index compound: storyId + createdAt");

    // Index cho text search trong chapters
    await db
      .collection("chapters")
      .createIndex(
        { title: "text", content: "text" },
        { name: "chapter_text_search" }
      );
    console.log("✅ Index text search: title, content");

    // ==================== USERS COLLECTION ====================
    console.log("\n👤 Tạo indexes cho collection 'users'...");

    // Index unique cho email
    await db
      .collection("users")
      .createIndex({ email: 1 }, { name: "user_email_unique", unique: true });
    console.log("✅ Index unique: email");

    // Index cho googleId
    await db
      .collection("users")
      .createIndex(
        { googleId: 1 },
        { name: "user_google_id_index", sparse: true }
      );
    console.log("✅ Index: googleId (sparse)");

    // Index cho role (admin/user filter)
    await db
      .collection("users")
      .createIndex({ role: 1 }, { name: "user_role_index" });
    console.log("✅ Index: role");

    // Index cho favorites array (query stories yêu thích)
    await db
      .collection("users")
      .createIndex({ favorites: 1 }, { name: "user_favorites_index" });
    console.log("✅ Index: favorites");

    // ==================== CATEGORIES COLLECTION ====================
    console.log("\n🏷️ Tạo indexes cho collection 'categories'...");

    // Index unique cho tên thể loại
    await db
      .collection("categories")
      .createIndex({ name: 1 }, { name: "category_name_unique", unique: true });
    console.log("✅ Index unique: name");

    // Index unique cho slug
    await db
      .collection("categories")
      .createIndex(
        { slug: 1 },
        { unique: true, sparse: true, name: "category_slug_unique" }
      );
    console.log("✅ Index unique: slug");

    // Index cho text search
    await db
      .collection("categories")
      .createIndex(
        { name: "text", description: "text" },
        { name: "category_text_search" }
      );
    console.log("✅ Index text search: name, description");

    // ==================== AUTHORS COLLECTION ====================
    console.log("\n✍️ Tạo indexes cho collection 'authors'...");

    // Index cho tên tác giả
    await db
      .collection("authors")
      .createIndex({ fullName: 1 }, { name: "author_name_index" });
    console.log("✅ Index: fullName");

    // Index cho text search
    await db
      .collection("authors")
      .createIndex(
        { fullName: "text", bio: "text" },
        { name: "author_text_search" }
      );
    console.log("✅ Index text search: fullName, bio");

    // ==================== CONTACTS COLLECTION ====================
    console.log("\n📧 Tạo indexes cho collection 'contacts'...");

    // Index cho email
    await db
      .collection("contacts")
      .createIndex({ email: 1 }, { name: "contact_email_index" });
    console.log("✅ Index: email");

    // Index cho favorite (để filter)
    await db
      .collection("contacts")
      .createIndex({ favorite: 1 }, { name: "contact_favorite_index" });
    console.log("✅ Index: favorite");

    // ==================== RATINGS COLLECTION ====================
    console.log("\n⭐ Tạo indexes cho collection 'ratings'...");

    // Index compound cho userId + storyId (unique)
    await db
      .collection("ratings")
      .createIndex(
        { userId: 1, storyId: 1 },
        { name: "rating_user_story_unique", unique: true }
      );
    console.log("✅ Index unique compound: userId + storyId");

    // Index cho storyId (để query ratings của một truyện)
    await db
      .collection("ratings")
      .createIndex({ storyId: 1 }, { name: "rating_story_index" });
    console.log("✅ Index: storyId");

    // Index cho rating value (để filter)
    await db
      .collection("ratings")
      .createIndex({ rating: 1 }, { name: "rating_value_index" });
    console.log("✅ Index: rating");

    // Index cho createdAt (để sort)
    await db
      .collection("ratings")
      .createIndex({ createdAt: -1 }, { name: "rating_created_index" });
    console.log("✅ Index: createdAt (descending)");

    // ==================== COMMENTS COLLECTION ====================
    console.log("\n💬 Tạo indexes cho collection 'comments'...");

    // Index cho storyId + chapterId (query comments theo truyện/chương)
    await db
      .collection("comments")
      .createIndex(
        { storyId: 1, chapterId: 1, createdAt: -1 },
        { name: "comment_story_chapter_index" }
      );
    console.log("✅ Index compound: storyId + chapterId + createdAt");

    // Index cho userId (query comments của user)
    await db
      .collection("comments")
      .createIndex(
        { userId: 1, createdAt: -1 },
        { name: "comment_user_index" }
      );
    console.log("✅ Index compound: userId + createdAt");

    // Index cho parentId (query replies)
    await db
      .collection("comments")
      .createIndex(
        { parentId: 1 },
        { name: "comment_parent_index", sparse: true }
      );
    console.log("✅ Index: parentId (sparse)");

    // ==================== COMMENT_LIKES COLLECTION ====================
    console.log("\n👍 Tạo indexes cho collection 'comment_likes'...");

    // Compound index unique: commentId + userId
    await db
      .collection("comment_likes")
      .createIndex(
        { commentId: 1, userId: 1 },
        { unique: true, name: "comment_like_unique" }
      );
    console.log("✅ Index compound unique: commentId + userId");

    // Index cho commentId (để đếm likes)
    await db
      .collection("comment_likes")
      .createIndex({ commentId: 1 }, { name: "comment_like_commentId_index" });
    console.log("✅ Index: commentId");

    // Index cho userId (để lấy comments user đã like)
    await db
      .collection("comment_likes")
      .createIndex({ userId: 1 }, { name: "comment_like_userId_index" });
    console.log("✅ Index: userId");

    // ==================== COMMENT_REPORTS COLLECTION ====================
    console.log("\n🚩 Tạo indexes cho collection 'comment_reports'...");

    // Compound index unique: commentId + userId
    await db
      .collection("comment_reports")
      .createIndex(
        { commentId: 1, userId: 1 },
        { unique: true, name: "comment_report_unique" }
      );
    console.log("✅ Index compound unique: commentId + userId");

    // Index cho commentId + status
    await db
      .collection("comment_reports")
      .createIndex(
        { commentId: 1, status: 1 },
        { name: "comment_report_status_index" }
      );
    console.log("✅ Index compound: commentId + status");

    // Index cho status + createdAt (admin query)
    await db
      .collection("comment_reports")
      .createIndex(
        { status: 1, createdAt: -1 },
        { name: "comment_report_admin_index" }
      );
    console.log("✅ Index compound: status + createdAt");

    // ==================== HISTORIES COLLECTION ====================
    console.log("\n📖 Tạo indexes cho collection 'histories'...");

    // Compound index unique: userId + storyId (một user chỉ có một history cho mỗi truyện)
    await db
      .collection("histories")
      .createIndex(
        { userId: 1, storyId: 1 },
        { unique: true, name: "history_user_story_unique" }
      );
    console.log("✅ Index compound unique: userId + storyId");

    // Index cho userId + lastReadAt (query lịch sử của user, sort theo thời gian)
    await db
      .collection("histories")
      .createIndex(
        { userId: 1, lastReadAt: -1 },
        { name: "history_user_lastread_index" }
      );
    console.log("✅ Index compound: userId + lastReadAt (descending)");

    // Index cho storyId (đếm số người đọc truyện)
    await db
      .collection("histories")
      .createIndex({ storyId: 1 }, { name: "history_story_index" });
    console.log("✅ Index: storyId");

    // TTL Index - Tự động xóa history cũ hơn 90 ngày
    await db
      .collection("histories")
      .createIndex(
        { lastReadAt: 1 },
        { expireAfterSeconds: 90 * 24 * 60 * 60, name: "history_ttl_index" }
      );
    console.log("✅ TTL Index: lastReadAt (expire after 90 days)");

    // ==================== USERS FAVORITES ====================
    console.log("\n❤️ Tạo indexes cho users.favorites...");

    // Index cho favorites array trong users collection
    await db
      .collection("users")
      .createIndex({ favorites: 1 }, { name: "user_favorites_index" });
    console.log("✅ Index: favorites (array)");

    // ==================== BANNERS COLLECTION ====================
    console.log("\n🎨 Tạo indexes cho collection 'banners'...");

    // Index cho isActive + order (query banners đang hiển thị)
    await db
      .collection("banners")
      .createIndex(
        { isActive: 1, order: 1 },
        { name: "banner_active_order_index" }
      );
    console.log("✅ Index compound: isActive + order");

    // Index cho categoryId (query banners theo category)
    await db
      .collection("banners")
      .createIndex(
        { categoryId: 1 },
        { name: "banner_category_index", sparse: true }
      );
    console.log("✅ Index: categoryId (sparse)");

    // Index cho createdAt (sort theo thời gian)
    await db
      .collection("banners")
      .createIndex({ createdAt: -1 }, { name: "banner_created_index" });
    console.log("✅ Index: createdAt (descending)");

    // Index text search cho title và subtitle
    await db
      .collection("banners")
      .createIndex(
        { title: "text", subtitle: "text" },
        { name: "banner_text_search" }
      );
    console.log("✅ Index text search: title, subtitle");

    // ==================== ADS COLLECTION ====================
    console.log("\n📢 Tạo indexes cho collection 'ads'...");

    // Index cho isActive + position (query ads theo vị trí)
    await db
      .collection("ads")
      .createIndex(
        { isActive: 1, position: 1 },
        { name: "ad_active_position_index" }
      );
    console.log("✅ Index compound: isActive + position");

    // Index cho startDate và endDate (query ads theo thời gian)
    await db
      .collection("ads")
      .createIndex(
        { startDate: 1, endDate: 1 },
        { name: "ad_date_range_index" }
      );
    console.log("✅ Index compound: startDate + endDate");

    // Index cho createdAt
    await db
      .collection("ads")
      .createIndex({ createdAt: -1 }, { name: "ad_created_index" });
    console.log("✅ Index: createdAt (descending)");

    // ==================== WEBSITEINFO COLLECTION ====================
    console.log("\n🌐 Tạo indexes cho collection 'websiteinfo'...");

    // Index cho key (unique) - nếu dùng key-value pattern
    await db
      .collection("websiteinfo")
      .createIndex(
        { key: 1 },
        { name: "websiteinfo_key_unique", unique: true, sparse: true }
      );
    console.log("✅ Index unique: key (sparse)");

    // Index cho updatedAt
    await db
      .collection("websiteinfo")
      .createIndex({ updatedAt: -1 }, { name: "websiteinfo_updated_index" });
    console.log("✅ Index: updatedAt (descending)");

    console.log("\n✨ Hoàn thành tạo tất cả indexes!");
    console.log("\n📊 Thống kê indexes:");

    // Hiển thị tất cả indexes đã tạo
    const collections = [
      "stories",
      "chapters",
      "users",
      "categories",
      "authors",
      "contacts",
      "ratings",
      "comments",
      "comment_likes",
      "comment_reports",
      "histories",
      "banners",
      "ads",
      "websiteinfo",
    ];

    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`\n${collectionName}: ${indexes.length} indexes`);
      indexes.forEach((index) => {
        console.log(`  - ${index.name}`);
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi tạo indexes:", error);
    throw error;
  }
}

/**
 * Xóa tất cả indexes (trừ _id) - dùng khi cần reset
 */
async function dropAllIndexes() {
  try {
    console.log("🗑️ Xóa tất cả indexes (trừ _id)...");
    const db = MongoDB.client.db();
    const collections = [
      "stories",
      "chapters",
      "users",
      "categories",
      "authors",
      "contacts",
      "ratings",
      "comments",
      "comment_likes",
      "comment_reports",
      "histories",
      "banners",
      "ads",
      "websiteinfo",
    ];

    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).dropIndexes();
        console.log(`✅ Đã xóa indexes của ${collectionName}`);
      } catch (error) {
        console.log(
          `⚠️ Không thể xóa indexes của ${collectionName}:`,
          error.message
        );
      }
    }

    console.log("\n✨ Hoàn thành xóa indexes!");
  } catch (error) {
    console.error("❌ Lỗi khi xóa indexes:", error);
    throw error;
  }
}

/**
 * Chạy script từ command line
 */
async function main() {
  const command = process.argv[2];

  try {
    // Kết nối MongoDB
    await MongoDB.connect();
    console.log("✅ Đã kết nối MongoDB");

    if (command === "create") {
      await createIndexes();
    } else if (command === "drop") {
      await dropAllIndexes();
    } else if (command === "reset") {
      await dropAllIndexes();
      await createIndexes();
    } else {
      console.log("📚 Sử dụng:");
      console.log("  node create-indexes.js create  - Tạo indexes");
      console.log("  node create-indexes.js drop    - Xóa indexes");
      console.log("  node create-indexes.js reset   - Xóa và tạo lại");
    }
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  } finally {
    // Đóng kết nối
    await MongoDB.disconnect();
    console.log("\n✅ Đã đóng kết nối MongoDB");
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  main();
}

module.exports = { createIndexes, dropAllIndexes };
