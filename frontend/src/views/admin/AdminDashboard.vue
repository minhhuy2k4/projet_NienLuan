<template>
    <div class="admin-wrapper">
        <div class="admin-layout">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h3>Quản Trị</h3><span>AudioTruyen</span>
                </div>
                <nav class="sidebar-nav">
                    <router-link :to="{ name: 'admin.dashboard' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </span>
                        Tổng quan
                    </router-link>
                    <router-link :to="{ name: 'admin.story.list' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </span>
                        Quản lý Truyện
                    </router-link>
                    <router-link :to="{ name: 'admin.category.list' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z">
                                </path>
                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                        </span>
                        Quản lý Thể loại
                    </router-link>
                    <router-link :to="{ name: 'admin.author.list' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                <path d="M2 2l7.586 7.586"></path>
                                <circle cx="11" cy="11" r="2"></circle>
                            </svg>
                        </span>
                        Quản lý Tác giả
                    </router-link>
                    <router-link :to="{ name: 'admin.users' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </span>
                        Quản lý Người dùng
                    </router-link>
                    <router-link :to="{ name: 'admin.ratings' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                </polygon>
                            </svg>
                        </span>
                        Quản lý Đánh giá
                    </router-link>
                    <router-link :to="{ name: 'admin.comments' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </span>
                        Quản lý Bình luận
                    </router-link>
                    <router-link :to="{ name: 'admin.banners' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </span>
                        Quản lý Banner
                    </router-link>
                    <router-link :to="{ name: 'admin.ads' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </span>
                        Quản lý Quảng cáo
                    </router-link>
                    <router-link :to="{ name: 'admin.websiteinfo' }" class="nav-item">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                <circle cx="9" cy="10" r="1"></circle>
                                <circle cx="15" cy="10" r="1"></circle>
                                <path d="M9 15c.5.5 1.5 1 3 1s2.5-.5 3-1"></path>
                            </svg>
                        </span>
                        Thông tin Chatbot
                    </router-link>
                    <router-link to="/" class="nav-item nav-back">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </span>
                        Quay về Trang chủ
                    </router-link>
                </nav>
            </aside>

            <router-view />

        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Ensure admin always uses light theme
onMounted(() => {
    // Force remove dark class when entering admin
    document.documentElement.classList.remove('dark');
});

onUnmounted(() => {
    // Reapply user's theme preference when leaving admin
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
});
</script>

<style>
/* Import admin theme - độc lập với theme chính */
@import '@/assets/admin-theme.css';

/* Override some styles for this specific layout if needed */
.admin-layout {
    max-width: 1600px;
}


/* Style chung cho nội dung admin */
.main-content {
    padding: 2rem;
    overflow-y: auto;
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.content-header h2 {
    margin: 0;
}

.main-data-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1.5rem;
}

.data-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
}

.data-card h3 {
    margin: 0 0 1.5rem 0;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 1rem;
}

.form-simple .form-group {
    margin-bottom: 1rem;
}

.form-simple label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-simple input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-light);
    border-radius: 8px;
}

.submit-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: var(--primary-blue);
    color: white;
    font-weight: 700;
    cursor: pointer;
}

.submit-button:disabled {
    background-color: #ccc;
}

.item-list {
    list-style-type: none;
    padding: 0;
}

.item-list li {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
}

.error-message {
    color: red;
    font-size: 0.9rem;
}

@media (max-width: 992px) {
    .admin-layout {
        grid-template-columns: 1fr;
    }

    .sidebar {
        min-height: auto;
        border-right: none;
        border-bottom: 1px solid var(--border-light);
        flex-direction: row;
        overflow-x: auto;
        padding: 0.5rem;
    }

    .sidebar-header {
        display: none;
    }

    .sidebar-nav {
        flex-direction: row;
        margin-top: 0;
    }

    .nav-back {
        margin-top: 0;
        border-top: none;
        border-left: 1px solid var(--border-light);
    }

    .main-data-grid {
        grid-template-columns: 1fr;
    }
}
</style>