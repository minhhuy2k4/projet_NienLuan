import createApiClient from "./api.service";

class GoogleAuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
    this.baseUrl = baseUrl;
    // Lấy domain từ biến môi trường hoặc mặc định
    this.domain = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
  }

  signInWithGoogle() {
    // Redirect tới backend để login Google
    window.location.href = `${this.domain}${this.baseUrl}/google-login`;
  }

  async handleCallback(code) {
    // Gửi code từ Google về backend để xử lý
    const response = await this.api.post(`/google-callback`, { code });
    return response.data;
  }
}

export default new GoogleAuthService();
