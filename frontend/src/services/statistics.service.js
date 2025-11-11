import createApiClient from "./api.service";

class StatisticsService {
  constructor(baseUrl = "/api") {
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy thống kê tổng quan
   */
  async getOverviewStats() {
    try {
      const response = await this.api.get("/statistics/overview");
      return response.data;
    } catch (error) {
      console.error("Get overview stats error:", error);
      throw error;
    }
  }

  /**
   * Lấy top stories theo lượt xem
   */
  async getTopStories(limit = 10) {
    try {
      const response = await this.api.get(
        `/statistics/top-stories?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Get top stories error:", error);
      throw error;
    }
  }
}

export default new StatisticsService();
