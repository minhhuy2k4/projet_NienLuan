import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Import CSS toàn cục
import "./assets/main.css";
import "./assets/theme.css";
import "./assets/dark-mode-overrides.css";
import "./assets/pages.css";

const app = createApp(App);

app.use(createPinia()); // Sử dụng Pinia
app.use(router); // Sử dụng Router

app.mount("#app");
