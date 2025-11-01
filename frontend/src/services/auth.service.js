import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    // Không cần lo lắng về token ở đây
    return (await this.api.post("/login", data)).data;
  }

  async register(data) {
    // Không cần lo lắng về token ở đây
    return (await this.api.post("/register", data)).data;
  }
}

export default new AuthService();
