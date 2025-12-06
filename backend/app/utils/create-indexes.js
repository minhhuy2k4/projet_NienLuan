const MongoDB = require("./mongodb.util");

/**
 * Tạo indexes cho các collection để tăng tốc độ truy vấn
 */
async function createIndexes() {
  try {
    const db = MongoDB.client.db();

    // ==================== STORIES COLLECTION ====================

    // Index cho tìm kiếm theo tên truyện (text search)
    await db
      .collection("stories")
      .createIndex(
        { name: "text", description: "text" },
        { name: "story_text_search" }
      );

    // Index cho filter theo authors
    await db
      .collection("stories")
      .createIndex({ authors: 1 }, { name: "story_authors_index" });

    // Index cho filter theo categories
    await db
      .collection("stories")
      .createIndex({ categories: 1 }, { name: "story_categories_index" });

    // Index cho slug (SEO-friendly URLs) - UNIQUE
    await db
      .collection("stories")
      .createIndex(
        { slug: 1 },
        { unique: true, sparse: true, name: "slug_unique_index" }
      );

    // Index cho sắp xếp theo views (truyện hot)
    await db
      .collection("stories")
      .createIndex({ views: -1 }, { name: "story_views_index" });

    // Index cho sắp xếp theo updatedAt (truyện mới cập nhật)
    await db
      .collection("stories")
      .createIndex({ updatedAt: -1 }, { name: "story_updated_index" });

    // Index compound cho filter + sort
    await db
      .collection("stories")
      .createIndex(
        { categories: 1, updatedAt: -1 },
        { name: "story_category_updated_index" }
      );

    // ==================== CHAPTERS COLLECTION ====================

    // Index cho query chapters theo storyId
    await db
      .collection("chapters")
      .createIndex(
        { storyId: 1, chapterNumber: 1 },
        { name: "chapter_story_number_index" }
      );

    // Index cho sắp xếp chapters
    await db
      .collection("chapters")
      .createIndex(
        { storyId: 1, createdAt: -1 },
        { name: "chapter_story_created_index" }
      );

    // Index cho text search trong chapters
    await db
      .collection("chapters")
      .createIndex(
        { title: "text", content: "text" },
        { name: "chapter_text_search" }
      );

    // ==================== USERS COLLECTION ====================

    // Index unique cho email
    await db
      .collection("users")
      .createIndex({ email: 1 }, { name: "user_email_unique", unique: true });

    // Index cho googleId
    await db
      .collection("users")
      .createIndex(
        { googleId: 1 },
        { name: "user_google_id_index", sparse: true }
      );

    // Index cho role (admin/user filter)
    await db
      .collection("users")
      .createIndex({ role: 1 }, { name: "user_role_index" });

    // Index cho favorites array (query stories yêu thích)
    await db
      .collection("users")
      .createIndex({ favorites: 1 }, { name: "user_favorites_index" });

    // ==================== CATEGORIES COLLECTION ====================

    // Index unique cho tên thể loại
    await db
      .collection("categories")
      .createIndex({ name: 1 }, { name: "category_name_unique", unique: true });

    // Index unique cho slug
    await db
      .collection("categories")
      .createIndex(
        { slug: 1 },
        { unique: true, sparse: true, name: "category_slug_unique" }
      );

    // Index cho text search
    await db
      .collection("categories")
      .createIndex(
        { name: "text", description: "text" },
        { name: "category_text_search" }
      );

    // ==================== AUTHORS COLLECTION ====================

    // Index cho tên tác giả
    await db
      .collection("authors")
      .createIndex({ fullName: 1 }, { name: "author_name_index" });

    // Index cho text search
    await db
      .collection("authors")
      .createIndex(
        { fullName: "text", bio: "text" },
        { name: "author_text_search" }
      );

    // ==================== CONTACTS COLLECTION ====================

    // Index cho email
    await db
      .collection("contacts")
      .createIndex({ email: 1 }, { name: "contact_email_index" });

    // Index cho favorite (để filter)
    await db
      .collection("contacts")
      .createIndex({ favorite: 1 }, { name: "contact_favorite_index" });

    // ==================== RATINGS COLLECTION ====================

    // Index compound cho userId + storyId (unique)
    await db
      .collection("ratings")
      .createIndex(
        { userId: 1, storyId: 1 },
        { name: "rating_user_story_unique", unique: true }
      );

    // Index cho storyId (để query ratings của một truyện)
    await db
      .collection("ratings")
      .createIndex({ storyId: 1 }, { name: "rating_story_index" });

    // Index cho rating value (để filter)
    await db
      .collection("ratings")
      .createIndex({ rating: 1 }, { name: "rating_value_index" });

    // Index cho createdAt (để sort)
    await db
      .collection("ratings")
      .createIndex({ createdAt: -1 }, { name: "rating_created_index" });

    // ==================== COMMENTS COLLECTION ====================

    // Index cho storyId + chapterId (query comments theo truyện/chương)
    await db
      .collection("comments")
      .createIndex(
        { storyId: 1, chapterId: 1, createdAt: -1 },
        { name: "comment_story_chapter_index" }
      );

    // Index cho userId (query comments của user)
    await db
      .collection("comments")
      .createIndex(
        { userId: 1, createdAt: -1 },
        { name: "comment_user_index" }
      );

    // Index cho parentId (query replies)
    await db
      .collection("comments")
      .createIndex(
        { parentId: 1 },
        { name: "comment_parent_index", sparse: true }
      );

    // ==================== COMMENT_LIKES COLLECTION ====================

    // Compound index unique: commentId + userId
    await db
      .collection("comment_likes")
      .createIndex(
        { commentId: 1, userId: 1 },
        { unique: true, name: "comment_like_unique" }
      );

    // Index cho commentId (để đếm likes)
    await db
      .collection("comment_likes")
      .createIndex({ commentId: 1 }, { name: "comment_like_commentId_index" });

    // Index cho userId (để lấy comments user đã like)
    await db
      .collection("comment_likes")
      .createIndex({ userId: 1 }, { name: "comment_like_userId_index" });

    // ==================== COMMENT_REPORTS COLLECTION ====================

    // Compound index unique: commentId + userId
    await db
      .collection("comment_reports")
      .createIndex(
        { commentId: 1, userId: 1 },
        { unique: true, name: "comment_report_unique" }
      );

    // Index cho commentId + status
    await db
      .collection("comment_reports")
      .createIndex(
        { commentId: 1, status: 1 },
        { name: "comment_report_status_index" }
      );

    // Index cho status + createdAt (admin query)
    await db
      .collection("comment_reports")
      .createIndex(
        { status: 1, createdAt: -1 },
        { name: "comment_report_admin_index" }
      );

    // ==================== HISTORIES COLLECTION ====================

    // Compound index unique: userId + storyId (một user chỉ có một history cho mỗi truyện)
    await db
      .collection("histories")
      .createIndex(
        { userId: 1, storyId: 1 },
        { unique: true, name: "history_user_story_unique" }
      );

    // Index cho userId + lastReadAt (query lịch sử của user, sort theo thời gian)
    await db
      .collection("histories")
      .createIndex(
        { userId: 1, lastReadAt: -1 },
        { name: "history_user_lastread_index" }
      );

    // Index cho storyId (đếm số người đọc truyện)
    await db
      .collection("histories")
      .createIndex({ storyId: 1 }, { name: "history_story_index" });

    // TTL Index - Tự động xóa history cũ hơn 90 ngày
    await db
      .collection("histories")
      .createIndex(
        { lastReadAt: 1 },
        { expireAfterSeconds: 90 * 24 * 60 * 60, name: "history_ttl_index" }
      );

    // ==================== USERS FAVORITES ====================

    // Index cho favorites array trong users collection
    await db
      .collection("users")
      .createIndex({ favorites: 1 }, { name: "user_favorites_index" });

    // ==================== BANNERS COLLECTION ====================

    // Index cho isActive + order (query banners đang hiển thị)
    await db
      .collection("banners")
      .createIndex(
        { isActive: 1, order: 1 },
        { name: "banner_active_order_index" }
      );

    // Index cho categoryId (query banners theo category)
    await db
      .collection("banners")
      .createIndex(
        { categoryId: 1 },
        { name: "banner_category_index", sparse: true }
      );

    // Index cho createdAt (sort theo thời gian)
    await db
      .collection("banners")
      .createIndex({ createdAt: -1 }, { name: "banner_created_index" });

    // Index text search cho title và subtitle
    await db
      .collection("banners")
      .createIndex(
        { title: "text", subtitle: "text" },
        { name: "banner_text_search" }
      );

    // ==================== ADS COLLECTION ====================

    // Index cho isActive + position (query ads theo vị trí)
    await db
      .collection("ads")
      .createIndex(
        { isActive: 1, position: 1 },
        { name: "ad_active_position_index" }
      );

    // Index cho startDate và endDate (query ads theo thời gian)
    await db
      .collection("ads")
      .createIndex(
        { startDate: 1, endDate: 1 },
        { name: "ad_date_range_index" }
      );

    // Index cho createdAt
    await db
      .collection("ads")
      .createIndex({ createdAt: -1 }, { name: "ad_created_index" });

    // ==================== WEBSITEINFO COLLECTION ====================

    // Index cho key (unique) - nếu dùng key-value pattern
    await db
      .collection("websiteinfo")
      .createIndex(
        { key: 1 },
        { name: "websiteinfo_key_unique", unique: true, sparse: true }
      );

    // Index cho updatedAt
    await db
      .collection("websiteinfo")
      .createIndex({ updatedAt: -1 }, { name: "websiteinfo_updated_index" });
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
      } catch (error) {}
    }
  } catch (error) {
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

    if (command === "create") {
      await createIndexes();
    } else if (command === "drop") {
      await dropAllIndexes();
    } else if (command === "reset") {
      await dropAllIndexes();
      await createIndexes();
    } else {
    }
  } catch (error) {
    process.exit(1);
  } finally {
    // Đóng kết nối
    await MongoDB.disconnect();
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  main();
}

module.exports = { createIndexes, dropAllIndexes };
