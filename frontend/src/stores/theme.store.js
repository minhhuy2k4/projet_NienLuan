import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  // State: 'light' hoặc 'dark'
  const theme = ref("light");

  // Khởi tạo theme từ localStorage hoặc system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      theme.value = savedTheme;
    } else {
      // Kiểm tra system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      theme.value = prefersDark ? "dark" : "light";
    }

    applyTheme();
  };

  // Áp dụng theme vào HTML element
  const applyTheme = () => {
    const html = document.documentElement;

    if (theme.value === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  // Toggle giữa light và dark
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme.value);
    applyTheme();
  };

  // Set theme cụ thể
  const setTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      theme.value = newTheme;
      localStorage.setItem("theme", theme.value);
      applyTheme();
    }
  };

  // Getter để kiểm tra dark mode
  const isDark = () => theme.value === "dark";

  return {
    theme,
    initTheme,
    applyTheme,
    toggleTheme,
    setTheme,
    isDark,
  };
});
