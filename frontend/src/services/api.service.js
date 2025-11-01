// src/services/api.service.js

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

  // Cấu hình Interceptor
  api.interceptors.request.use(
    (config) => {
      // Khởi tạo store bên trong interceptor
      const authStore = useAuthStore();

      if (authStore.token) {
        // Nếu có token, gắn nó vào header Authorization
        config.headers["Authorization"] = `Bearer ${authStore.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiClient;
