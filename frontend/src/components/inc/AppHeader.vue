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
                <!-- Theme Toggle Button -->
                <ThemeToggle />

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
import ThemeToggle from '@/components/ThemeToggle.vue';

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
    background: var(--bg-card);
    box-shadow: var(--shadow-md);
    border-bottom: 1px solid var(--border-color);
    transition: all var(--transition-base);
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
    color: var(--color-primary);
    text-decoration: none;
    transition: transform 0.3s ease, color var(--transition-base);
}

.logo:hover {
    transform: scale(1.05);
    color: var(--color-primary-light);
}

.search-bar {
    display: flex;
}

.search-bar input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    outline: none;
    min-width: 250px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: border-color var(--transition-base);
}

.search-bar input::placeholder {
    color: var(--text-tertiary);
}

.search-bar input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

.search-bar button {
    border: none;
    padding: 0 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-left: none;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    cursor: pointer;
    transition: background-color var(--transition-base);
    color: var(--text-secondary);
}

.search-bar button:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.nav-button {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
    border: 1px solid transparent;
    background: none;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
}

.nav-button:hover {
    background-color: var(--bg-tertiary);
    transform: translateY(-1px);
}

.nav-button.primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.nav-button.primary:hover {
    background-color: var(--color-primary-light);
    border-color: var(--color-primary-light);
    box-shadow: var(--shadow-md);
}

.user-info {
    font-weight: 500;
    padding: 0 0.5rem;
    color: var(--text-primary);
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
    color: var(--text-primary);
    text-decoration: none;
    transition: color var(--transition-base);
    position: relative;
}

.sub-nav a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-primary);
    transition: width var(--transition-base);
}

.sub-nav a:hover {
    color: var(--color-primary);
}

.sub-nav a:hover::after {
    width: 100%;
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
    color: var(--text-primary);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-base);
}

.user-name-button:hover {
    background-color: var(--bg-tertiary);
}

.dropdown-content {
    display: block;
    position: absolute;
    right: 0;
    top: 100%;
    background-color: var(--bg-card);
    min-width: 200px;
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-lg);
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
    color: var(--text-primary);
    padding: 10px 14px;
    text-decoration: none;
    display: block;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color var(--transition-base), color var(--transition-base);
}

.dropdown-item:hover {
    background-color: var(--bg-tertiary);
    color: var(--color-primary);
}

.logout-item {
    color: var(--color-danger);
    font-weight: 500;
}

.logout-item:hover {
    background-color: rgba(239, 68, 68, 0.1);
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
