<template>
    <header class="main-header">
        <nav class="navbar">
            <div class="nav-left">
                <router-link to="/" class="logo">
                    <span>🎧 AudioTruyen</span>
                </router-link>
                <div class="search-bar">
                    <input type="text" placeholder="Tìm truyện..." v-model="searchQuery" @keyup.enter="handleSearch">
                    <button @click="handleSearch">🔍</button>
                </div>
            </div>

            <div class="nav-right">
                <template v-if="!authStore.isLoggedIn">
                    <router-link to="/login" class="nav-button">Đăng nhập</router-link>
                    <router-link to="/register" class="nav-button primary">Đăng ký</router-link>
                </template>

                <template v-else>
                    <!-- User Menu cho TẤT CẢ user đã login -->
                    <div class="user-menu" ref="userMenuRef">
                        <button @click="toggleDropdown" class="user-name-button">
                            Chào, {{ authStore.user.name }}
                            <span v-if="authStore.isAdmin">(Admin)</span>
                            ▾
                        </button>
                        <div v-if="dropdownOpen" class="dropdown-content">
                            <!-- Chỉ admin mới thấy link này -->
                            <router-link v-if="authStore.isAdmin" to="/admin" class="dropdown-item"
                                @click="closeDropdown">
                                📊 Trang Quản Lý
                            </router-link>
                            <hr v-if="authStore.isAdmin" class="dropdown-divider">

                            <!-- Tất cả user đều thấy -->
                            <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
                                👤 Trang cá nhân
                            </router-link>
                            <router-link to="/favorites" class="dropdown-item" @click="closeDropdown">
                                ❤️ Truyện yêu thích
                            </router-link>
                            <router-link to="/history" class="dropdown-item" @click="closeDropdown">
                                📚 Lịch sử đọc
                            </router-link>
                            <a href="#" class="dropdown-item" @click.prevent="closeDropdown">
                                ⚙️ Cài đặt
                            </a>
                            <hr class="dropdown-divider">
                            <a @click="handleLogout" class="dropdown-item logout-item">
                                🚪 Đăng xuất
                            </a>
                        </div>
                    </div>
                </template>
            </div>
        </nav>

        <div class="sub-nav">
            <router-link to="/">Trang chủ</router-link>
            <router-link to="/categories">Thể loại</router-link>
            <router-link to="/new-stories">Truyện mới</router-link>
            <router-link to="/full-stories">Truyện Full</router-link>
            <router-link to="/hot-stories">Truyện Hot</router-link>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref('');
const dropdownOpen = ref(false);
const userMenuRef = ref(null);

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ path: '/search', query: { q: searchQuery.value } });
        searchQuery.value = '';
    }
};

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
    dropdownOpen.value = false;
};

const handleLogout = () => {
    closeDropdown();
    authStore.logout();
    router.push('/login');
};

const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        closeDropdown();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.main-header {
    background: var(--white-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid var(--border-color);
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
    text-decoration: none;
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.05);
}

.search-bar {
    display: flex;
}

.search-bar input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 5px 0 0 5px;
    outline: none;
    min-width: 250px;
    transition: border-color 0.3s ease;
}

.search-bar input:focus {
    border-color: var(--primary-blue);
}

.search-bar button {
    border: none;
    padding: 0 0.75rem;
    background: #f0f0f0;
    border: 1px solid var(--border-color);
    border-left: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-bar button:hover {
    background: #e0e0e0;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.nav-button {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    background: none;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: none;
    color: var(--primary-text);
}

.nav-button:hover {
    background-color: #f0f0f0;
    transform: translateY(-1px);
}

.nav-button.primary {
    background-color: var(--primary-blue);
    color: white;
    border-color: var(--primary-blue);
}

.nav-button.primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}

.user-info {
    font-weight: 500;
    padding: 0 0.5rem;
    color: var(--primary-text);
}

.sub-nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 1.5rem;
    font-weight: 500;
}

.sub-nav a {
    color: var(--primary-text);
    text-decoration: none;
    transition: color 0.3s ease;
}

.sub-nav a:hover {
    color: var(--primary-blue);
}

.user-menu {
    position: relative;
    display: inline-block;
}

.user-name-button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--primary-text);
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.user-name-button:hover {
    background-color: #f0f0f0;
}

.dropdown-content {
    display: block;
    position: absolute;
    right: 0;
    top: 100%;
    background-color: var(--white-color);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    z-index: 100;
    margin-top: 0.5rem;
    border: 1px solid var(--border-color);
    overflow: hidden;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-item {
    color: var(--primary-text);
    padding: 10px 14px;
    text-decoration: none;
    display: block;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: #f1f1f1;
}

.logout-item {
    color: #dc3545;
    font-weight: 500;
}

.logout-item:hover {
    background-color: #fff5f5;
}

.dropdown-divider {
    border: 0;
    border-top: 1px solid var(--border-color);
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 1rem;
    }

    .nav-left {
        width: 100%;
        flex-direction: column;
        gap: 0.75rem;
    }

    .search-bar input {
        min-width: 200px;
    }

    .sub-nav {
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }
}
</style>
