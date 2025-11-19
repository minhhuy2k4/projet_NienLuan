import createApiClient from "./api.service";

class CommentService {
  constructor(baseUrl = "/api/comments") {
    this.api = createApiClient(baseUrl);
  }

  getByChapter(chapterId, limit = 10, skip = 0) {
    return this.api.get(`/chapter/${chapterId}?limit=${limit}&skip=${skip}`);
  }

  create(chapterId, content, parentId = null) {
    return this.api.post(`/`, { chapterId, content, parentId });
  }

  update(commentId, content) {
    return this.api.put(`/${commentId}`, { content });
  }

  delete(commentId) {
    return this.api.delete(`/${commentId}`);
  }

  toggleLike(commentId) {
    return this.api.post(`/${commentId}/like`);
  }

  report(commentId, reason) {
    return this.api.post(`/${commentId}/report`, { reason });
  }

  getReportedComments(page = 1, limit = 10) {
    return this.api.get(`/reports?page=${page}&limit=${limit}`);
  }

  getReportStats() {
    return this.api.get(`/reports/stats`);
  }

  reviewReport(reportId, action) {
    return this.api.post(`/reports/${reportId}/review`, { action });
  }

  getAllComments(page = 1, limit = 10, search = "") {
    return this.api.get(`/all?page=${page}&limit=${limit}&search=${search}`);
  }

  getReported(limit = 20, skip = 0) {
    return this.api.get(`/reported?limit=${limit}&skip=${skip}`);
  }
}

export default new CommentService();
