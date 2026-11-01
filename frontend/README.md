<<<<<<< HEAD
# 🎧 AudioTruyen — Frontend Client
=======
# Frontend
>>>>>>> 15b8a8698f2cc558a7857320d42655e20c030b96

This is the Single Page Application (SPA) frontend for the **AudioTruyen** web novel and audiobook streaming platform, built with **Vue 3**, **Vite**, and **Tailwind CSS**.

---

## 🛠 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS Themes (Light & Dark mode support)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (`auth.store.js`, `theme.store.js`)
- **Routing**: [Vue Router 4](https://router.vuejs.org/) with authentication and admin navigation guards
- **Form Validation**: [Vee-Validate](https://vee-validate.logaretm.com/v4/) & [Yup](https://github.com/jquense/yup)
- **Icons**: [FontAwesome Free 6](https://fontawesome.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: Native JWT auth + Google OAuth 2.0 Integration

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create your `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Ensure the following variables are defined:

```env
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Development Server

Start the Vite development server on port `3001`:

```bash
npm run dev
```

### 4. Production Build

Compile and minify for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📁 Key Directories

- `src/views/`: Contains page views organized by domain (`admin/`, `auth/`, `category/`, `chapter/`, `story/`, `pages/`).
- `src/components/`: Reusable components including audio player, chatbot floating widget, comment threads, rating stars, and ad displays.
- `src/stores/`: Pinia stores for user session/auth and dark/light theme switching.
- `src/services/`: API client services communicating with the backend.
- `src/utils/media.js`: Centralized media URL resolution helper (see [MEDIA_UTILS_GUIDE.md](./MEDIA_UTILS_GUIDE.md)).
