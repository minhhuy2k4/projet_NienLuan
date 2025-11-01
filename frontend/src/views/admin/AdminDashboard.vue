<template>
    <div class="admin-wrapper">
        <div class="admin-layout">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h3>Quản Trị</h3><span>AudioTruyen</span>
                </div>
                <nav class="sidebar-nav">
                    <router-link :to="{ name: 'admin.dashboard' }" class="nav-item"><span class="icon">📊</span> Tổng
                        quan</router-link>
                    <router-link :to="{ name: 'admin.story.list' }" class="nav-item"><span class="icon">📚</span> Quản
                        lý Truyện</router-link>
                    <router-link :to="{ name: 'admin.category.list' }" class="nav-item"><span class="icon">🏷️</span>
                        Quản lý Thể loại</router-link>
                    <router-link :to="{ name: 'admin.author.list' }" class="nav-item"><span class="icon">✍️</span> Quản
                        lý Tác giả</router-link>
                    <router-link :to="{ name: 'admin.ratings' }" class="nav-item"><span class="icon">⭐</span> Quản lý
                        Đánh giá</router-link>
                    <router-link to="/" class="nav-item nav-back"><span class="icon">🏠</span> Quay về Trang
                        chủ</router-link>
                </nav>
            </aside>

            <router-view />

        </div>
    </div>
</template>

<style>
/* XÓA "scoped" để style áp dụng cho các trang con (router-view) */
:root {
    --admin-bg: #f4f7f6;
    --sidebar-bg: #ffffff;
    --card-bg: #ffffff;
    --text-primary: #333;
    --text-secondary: #777;
    --border-light: #e9ecef;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.admin-wrapper {
    background-color: var(--admin-bg);
    min-height: 100vh;
}

.admin-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    max-width: 1600px;
    margin: 0 auto;
}

.sidebar {
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    min-height: 100vh;
}

.sidebar-header {
    padding: 0 0.5rem 1.5rem 0.5rem;
    border-bottom: 1px solid var(--border-light);
}

.sidebar-header h3 {
    margin: 0 0 0.25rem 0;
    color: var(--primary-blue);
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
    gap: 0.5rem;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    color: var(--text-secondary);
    transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-item .icon {
    font-size: 1.2rem;
}

.nav-item:hover {
    background-color: #f0f7ff;
    color: var(--primary-blue);
}

.nav-item.router-link-exact-active {
    background-color: var(--primary-blue);
    color: white;
}

.nav-back {
    margin-top: auto;
    border-top: 1px solid var(--border-light);
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