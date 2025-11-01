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
  getReported(limit = 20, skip = 0) {
    return api.get(`/api/comments/reported?limit=${limit}&skip=${skip}`);
  }
}

export default new CommentService();
