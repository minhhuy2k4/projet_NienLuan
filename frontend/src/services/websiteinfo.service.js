import createApiClient from "./api.service";

class WebsiteInfoService {
  constructor(baseUrl = "/api/website-info") {
    this.api = createApiClient(baseUrl);
  }

  async get() {
    return (await this.api.get("/")).data;
  }

  async update(data) {
    return (await this.api.put("/", data)).data;
  }
}

export default new WebsiteInfoService();
