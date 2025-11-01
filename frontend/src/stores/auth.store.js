import { defineStore } from "pinia";
import authService from "@/services/auth.service"; // Sửa từ AuthService thành authService

const userStorage = JSON.parse(localStorage.getItem("user"));

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: userStorage ? userStorage.user : null,
    token: userStorage ? userStorage.token : null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,

    isAdmin: (state) => {
      return state.user && state.user.role === "admin";
    },
  },

  actions: {
    async login(emailOrUser, passwordOrToken) {
      try {
        let data;

        // Kiểm tra nếu đây là Google login (user object được truyền trực tiếp)
        if (
          typeof emailOrUser === "object" &&
          passwordOrToken &&
          typeof passwordOrToken === "string"
        ) {
          // Google login - emailOrUser là user object, passwordOrToken là token
          data = {
            user: emailOrUser,
            token: passwordOrToken,
          };
        } else {
          // Regular login với email và password
          data = await authService.login({
            email: emailOrUser,
            password: passwordOrToken,
          });
        }

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem("user", JSON.stringify(data));
        return true;
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return false;
      }
    },

    async register(name, email, password) {
      try {
        const response = await authService.register({ name, email, password }); // Sửa AuthService thành authService
        console.log("Register response:", response); // Debug log

        // Backend trả về message "Đăng ký thành công" khi thành công
        if (response.message === "Đăng ký thành công") {
          return { success: true, message: response.message };
        }
        return {
          success: false,
          message: response.message || "Đăng ký thất bại",
        };
      } catch (error) {
        console.error("Register error:", error);
        // Xử lý lỗi từ backend (email đã tồn tại, etc.)
        const message =
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi đăng ký";
        return { success: false, message };
      }
    },

    logout() {
      localStorage.removeItem("user");
      this.user = null;
      this.token = null;
    },
  },
});
