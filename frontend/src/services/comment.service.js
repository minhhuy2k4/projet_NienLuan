import createApiClient from "./api.service";

const api = createApiClient();

class CommentService {
  // Lấy comments của chapter
  getByChapter(chapterId, limit = 10, skip = 0) {
    return api.get(
      `/api/comments/chapter/${chapterId}?limit=${limit}&skip=${skip}`
    );
  }

  // Tạo comment mới
  create(chapterId, content, parentId = null) {
    return api.post("/api/comments", { chapterId, content, parentId });
  }

  // Cập nhật comment
  update(commentId, content) {
    return api.put(`/api/comments/${commentId}`, { content });
  }

  // Xóa comment
  delete(commentId) {
    return api.delete(`/api/comments/${commentId}`);
  }

  // Toggle like
  toggleLike(commentId) {
    return api.post(`/api/comments/${commentId}/like`);
  }

  // Report comment
  report(commentId, reason) {
    return api.post(`/api/comments/${commentId}/report`, { reason });
  }

  // Admin: Get reported comments
  getReportedComments(page = 1, limit = 10) {
    return api.get(`/api/comments/reports?page=${page}&limit=${limit}`);
  }

  // Admin: Get report statistics
  getReportStats() {
    return api.get("/api/comments/reports/stats");
  }

  // Admin: Review report (accept or dismiss)
  reviewReport(reportId, action) {
    return api.post(`/api/comments/reports/${reportId}/review`, { action });
  }

  // Admin: Get all comments with search
  getAllComments(page = 1, limit = 10, search = "") {
    return api.get(
      `/api/comments/all?page=${page}&limit=${limit}&search=${search}`
    );
  }

  // Admin: Get reported comments (old method - keep for compatibility)
  getReported(limit = 20, skip = 0) {
    return api.get(`/api/comments/reported?limit=${limit}&skip=${skip}`);
  }
}

export default new CommentService();
