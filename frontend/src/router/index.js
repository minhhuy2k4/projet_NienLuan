import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/pages/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/Register.vue"),
  },
  {
    path: "/story/:slug",
    name: "story.detail",
    component: () => import("@/views/story/StoryDetail.vue"),
    props: true,
  },
  {
    path: "/story/:storySlug/:chapterNumber",
    name: "chapter.detail",
    component: () => import("@/views/chapter/ChapterDetail.vue"),
    props: true,
  },
  {
    path: "/categories",
    name: "category.list",
    component: () => import("@/views/category/CategoryList.vue"),
  },
  {
    path: "/category/:slug",
    name: "category.detail",
    component: () => import("@/views/category/CategoryDetail.vue"),
    props: true,
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("@/views/pages/Favorite.vue"),
  },
  {
    path: "/history",
    name: "history",
    component: () => import("@/views/pages/History.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/pages/Profile.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/pages/Search.vue"),
  },
  // Google OAuth callback route
  {
    path: "/auth/google/callback",
    name: "google.callback",
    component: () => import("@/views/auth/GoogleCallback.vue"),
  },
  // Route admin chính - chỉ có một route /admin
  {
    path: "/admin",
    component: () => import("@/views/admin/AdminDashboard.vue"),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.isAdmin) {
        next();
      } else {
        next({ name: "home" });
      }
    },
    children: [
      {
        path: "",
        name: "admin.dashboard",
        component: () => import("@/views/admin/AdminOverview.vue"),
      },
      {
        path: "stories",
        name: "admin.story.list",
        component: () => import("@/views/admin/story/AdminStoryList.vue"),
      },
      {
        path: "stories/add",
        name: "admin.story.add",
        component: () => import("@/views/admin/story/StoryAdd.vue"),
      },
      {
        path: "stories/edit/:id",
        name: "admin.story.edit",
        component: () => import("@/views/admin/story/StoryEdit.vue"),
        props: true,
      },
      {
        path: "categories",
        name: "admin.category.list",
        component: () => import("@/views/admin/AdminCategory.vue"),
      },
      {
        path: "authors",
        name: "admin.author.list",
        component: () => import("@/views/admin/AdminAuthor.vue"),
      },
      {
        path: "users",
        name: "admin.users",
        component: () => import("@/views/admin/AdminUserManagement.vue"),
      },
      {
        path: "chapters/:storyId",
        name: "admin.chapter.manage",
        component: () => import("@/views/admin/ChapterManage.vue"),
        props: true,
      },
      {
        path: "ratings",
        name: "admin.ratings",
        component: () => import("@/views/admin/AdminRating.vue"),
      },
      {
        path: "comments",
        name: "admin.comments",
        component: () => import("@/views/admin/CommentManagement.vue"),
      },
      {
        path: "banners",
        name: "admin.banners",
        component: () => import("@/views/admin/BannerManagement.vue"),
      },
      {
        path: "ads",
        name: "admin.ads",
        component: () => import("@/views/admin/AdManagement.vue"),
      },
      {
        path: "website-info",
        name: "admin.websiteinfo",
        component: () => import("@/views/admin/WebsiteInfo.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/errors/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard để bảo vệ admin routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Kiểm tra nếu route yêu cầu admin
  if (to.path.startsWith("/admin")) {
    if (!authStore.isLoggedIn) {
      // Chưa đăng nhập -> redirect về login
      alert("Vui lòng đăng nhập để tiếp tục");
      next({ name: "login" });
    } else if (!authStore.isAdmin) {
      // Đã login nhưng không phải admin
      next({ name: "notfound" });
    } else {
      // Là admin -> cho phép
      next();
    }
  } else {
    // Không phải admin route -> cho phép
    next();
  }
});

export default router;
