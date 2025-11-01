import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

class GoogleAuthService {
  signInWithGoogle() {
    // Redirect to backend, backend sẽ redirect đến Google
    // Google sẽ callback về frontend port 3001
    window.location.href = `${API_URL.replace(
      "/api",
      ""
    )}/api/auth/google-login`;
  }

  async handleCallback(code) {
    // Gửi code từ Google về backend để xử lý
    const response = await axios.post(`${API_URL}/auth/google-callback`, {
      code: code,
    });

    return response.data;
  }
}

export default new GoogleAuthService();
