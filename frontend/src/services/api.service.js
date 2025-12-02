import axios from "axios";
// Import Pinia store để lấy thông tin token
import { useAuthStore } from "@/stores/auth.store";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const createApiClient = (baseURL) => {
  const api = axios.create({
    baseURL,
    ...commonConfig,
  });

  // Cấu hình Interceptor (request)
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers["Authorization"] = `Bearer ${authStore.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  //response interceptor để handle 401 và refresh token ---
  let isRefreshing = false;
  let refreshSubscribers = [];

  const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
  };

  const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error;
      const authStore = useAuthStore();

      if (response && response.status === 401 && !config._retry) {
        config._retry = true;

        // Nếu không có refreshToken thì logout / yêu cầu login lại
        if (!authStore.refreshToken) {
          if (typeof authStore.logout === "function") authStore.logout();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // chờ refresh hoàn thành rồi retry request
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              config.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(config));
            });
          });
        }

        isRefreshing = true;
        try {
          // Gọi endpoint refresh (điều chỉnh path nếu backend khác)
          const refreshResponse = await axios.post(
            `${baseURL.replace(/\/$/, "")}/auth/refresh`,
            { refreshToken: authStore.refreshToken }
          );

          const newToken = refreshResponse.data?.token;
          if (!newToken) {
            if (typeof authStore.logout === "function") authStore.logout();
            return Promise.reject(error);
          }

          // Lưu token mới vào store (điều chỉnh method theo store của bạn)
          if (typeof authStore.setToken === "function") {
            authStore.setToken(newToken);
          } else {
            authStore.token = newToken;
          }

          onRefreshed(newToken);
          config.headers["Authorization"] = `Bearer ${newToken}`;
          return api(config);
        } catch (e) {
          if (typeof authStore.logout === "function") authStore.logout();
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiClient;
