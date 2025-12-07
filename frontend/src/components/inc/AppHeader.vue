<template>
    <header class="main-header">
        <nav class="navbar">
            <div class="nav-left">
                <router-link to="/" class="logo">
                    <span><img src="/favicon.ico" alt="AudioMH" class="logo-icon" /> AudioMH</span>
                </router-link>
                <div class="search-bar" :class="{ 'mobile-search-open': mobileSearchOpen }">
                    <input type="text" placeholder="Tìm truyện..." v-model="searchQuery" @keyup.enter="handleSearch">
                    <button @click="handleSearch" aria-label="Tìm truyện">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true" focusable="false" style="vertical-align: middle">
                            <circle cx="11" cy="11" r="6"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Search Toggle -->
            <button class="mobile-search-toggle" @click="toggleMobileSearch" aria-label="Search"
                :class="{ 'hidden': mobileMenuOpen }">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Menu">
                <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>



            <!-- Mobile Overlay -->
            <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

            <!-- Mobile Menu Dropdown -->
            <div v-if="mobileMenuOpen" class="mobile-menu-dropdown">
                <!-- User Info Section -->
                <div class="mobile-user-section" v-if="authStore.isLoggedIn">
                    <div class="mobile-user-info">
                        <img v-if="authStore.user.avatar" :src="getAvatarUrl(authStore.user.avatar)"
                            :alt="authStore.user.name" class="mobile-user-avatar" />
                        <div v-else class="mobile-user-avatar-placeholder">
                            {{ getInitials(authStore.user.name) }}
                        </div>
                        <div class="mobile-user-details">
                            <span class="mobile-user-name">{{ authStore.user.name }}</span>
                            <span v-if="authStore.isAdmin" class="mobile-admin-badge">Admin</span>
                        </div>
                    </div>
                    <div class="mobile-user-links">
                        <router-link v-if="authStore.isAdmin" to="/admin" @click="closeMobileMenu">
                            <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            Trang Quản Lý
                        </router-link>
                        <router-link to="/profile" @click="closeMobileMenu">
                            <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Trang cá nhân
                        </router-link>
                        <router-link to="/favorites" @click="closeMobileMenu">
                            <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                </path>
                            </svg>
                            Truyện yêu thích
                        </router-link>
                        <router-link to="/history" @click="closeMobileMenu">
                            <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                            Lịch sử đọc
                        </router-link>
                        <a @click="handleLogout" class="mobile-logout">
                            <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Đăng xuất
                        </a>
                    </div>
                </div>

                <!-- Login/Register for non-logged users -->
                <div class="mobile-auth-section" v-else>
                    <router-link to="/login" class="mobile-auth-btn" @click="closeMobileMenu">Đăng nhập</router-link>
                    <router-link to="/register" class="mobile-auth-btn primary" @click="closeMobileMenu">Đăng
                        ký</router-link>
                </div>

                <!-- Sub Navigation -->
                <div class="mobile-sub-nav">
                    <router-link to="/" @click="closeMobileMenu">Trang chủ</router-link>
                    <router-link to="/categories" @click="closeMobileMenu">Thể loại</router-link>
                    <router-link to="/new-stories" @click="closeMobileMenu">Truyện mới</router-link>
                    <router-link to="/full-stories" @click="closeMobileMenu">Truyện Full</router-link>
                    <router-link to="/hot-stories" @click="closeMobileMenu">Truyện Hot</router-link>
                </div>

                <!-- Theme Toggle -->
                <div class="mobile-theme-toggle">
                    <ThemeToggle />
                </div>
            </div>

            <div class="nav-right" :class="{ 'mobile-nav-open': mobileMenuOpen }">
                <!-- Theme Toggle Button - Desktop -->
                <ThemeToggle class="desktop-theme-toggle" />

                <template v-if="!authStore.isLoggedIn">
                    <router-link to="/login" class="nav-button" @click="closeMobileMenu">Đăng nhập</router-link>
                    <router-link to="/register" class="nav-button primary" @click="closeMobileMenu">Đăng
                        ký</router-link>
                </template>

                <template v-else>
                    <!-- User Menu cho TẤT CẢ user đã login -->
                    <div class="user-menu" ref="userMenuRef">
                        <button @click="toggleDropdown" class="user-name-button">
                            <img v-if="authStore.user.avatar" :src="getAvatarUrl(authStore.user.avatar)"
                                :alt="authStore.user.name" class="user-avatar" />
                            <div v-else class="user-avatar-placeholder">
                                {{ getInitials(authStore.user.name) }}
                            </div>
                            <span class="user-name-text">
                                {{ authStore.user.name }}
                                <span v-if="authStore.isAdmin" class="admin-badge">Admin</span>
                            </span>
                            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M6 8L2 4h8L6 8z" />
                            </svg>
                        </button>
                        <div v-if="dropdownOpen" class="dropdown-content">
                            <!-- Chỉ admin mới thấy link này -->
                            <router-link v-if="authStore.isAdmin" to="/admin" class="dropdown-item"
                                @click="closeDropdownAndMenu">
                                <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                                Trang Quản Lý
                            </router-link>
                            <hr v-if="authStore.isAdmin" class="dropdown-divider">

                            <!-- Tất cả user đều thấy -->
                            <router-link to="/profile" class="dropdown-item" @click="closeDropdownAndMenu">
                                <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Trang cá nhân
                            </router-link>
                            <router-link to="/favorites" class="dropdown-item" @click="closeDropdownAndMenu">
                                <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                                Truyện yêu thích
                            </router-link>
                            <router-link to="/history" class="dropdown-item" @click="closeDropdownAndMenu">
                                <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                Lịch sử đọc
                            </router-link>
                            <hr class="dropdown-divider">
                            <a @click="handleLogout" class="dropdown-item logout-item">
                                <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Đăng xuất
                            </a>
                        </div>
                    </div>
                </template>

                <!-- Theme Toggle with Label -->
                <div class="theme-section">
                    <span class="theme-label">Chế độ hiển thị</span>
                    <ThemeToggle />
                </div>
            </div>
        </nav>

        <div class="sub-nav">
            <router-link to="/" @click="closeMobileMenu">Trang chủ</router-link>
            <router-link to="/categories" @click="closeMobileMenu">Thể loại</router-link>
            <router-link to="/new-stories" @click="closeMobileMenu">Truyện mới</router-link>
            <router-link to="/full-stories" @click="closeMobileMenu">Truyện Full</router-link>
            <router-link to="/hot-stories" @click="closeMobileMenu">Truyện Hot</router-link>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { getAvatarUrl } from '@/utils/media';

const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref('');
const dropdownOpen = ref(false);
const userMenuRef = ref(null);
const mobileMenuOpen = ref(false);
const mobileSearchOpen = ref(false);

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ path: '/search', query: { q: searchQuery.value } });
        searchQuery.value = '';
    }
};

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
    dropdownOpen.value = false;
};

const handleLogout = () => {
    closeDropdown();
    closeMobileMenu();
    authStore.logout();
    router.push('/login');
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    if (mobileMenuOpen.value) {
        mobileSearchOpen.value = false;
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
    document.body.style.overflow = '';
};

const toggleMobileSearch = () => {
    mobileSearchOpen.value = !mobileSearchOpen.value;
};

const closeDropdownAndMenu = () => {
    closeDropdown();
    closeMobileMenu();
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
    document.body.style.overflow = '';
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

/* Logo image sizing (global) */
.logo .logo-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: inline-block;
    vertical-align: middle;
}

@media (max-width: 480px) {
    .logo .logo-icon {
        width: 24px;
        height: 24px;
    }
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
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.user-name-button:hover {
    background-color: var(--bg-tertiary);
    transform: translateY(-1px);
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-primary);
    transition: all var(--transition-base);
}

.user-name-button:hover .user-avatar {
    border-color: var(--color-primary-light);
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}

.user-avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    border: 2px solid var(--color-primary);
    transition: all var(--transition-base);
}

.user-name-button:hover .user-avatar-placeholder {
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}

.user-name-text {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.admin-badge {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    background: var(--color-warning);
    color: white;
    border-radius: var(--radius-sm);
    font-weight: 600;
}

.dropdown-arrow {
    transition: transform var(--transition-base);
}

.user-menu[aria-expanded="true"] .dropdown-arrow {
    transform: rotate(180deg);
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
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color var(--transition-base), color var(--transition-base);
}

.dropdown-item .menu-icon {
    flex-shrink: 0;
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

/* Mobile Menu Toggle Button */
.mobile-menu-toggle,
.mobile-search-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--text-primary);
    transition: all var(--transition-base);
    z-index: 1001;
}

.mobile-search-toggle.hidden {
    opacity: 0;
    pointer-events: none;
}

.theme-section {
    display: none;
}

.desktop-theme-toggle {
    display: block;
}

.mobile-overlay {
    display: none;
}

@media (max-width: 768px) {
    .mobile-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
}

.mobile-menu-toggle svg,
.mobile-search-toggle svg {
    width: 24px;
    height: 24px;
}

.mobile-menu-toggle:hover,
.mobile-search-toggle:hover {
    color: var(--color-primary);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
}

/* Responsive */
@media (max-width: 968px) {
    .search-bar {
        display: none;
    }

    .mobile-search-toggle {
        display: block;
    }

    .search-bar.mobile-search-open {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        padding: 1rem;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        z-index: 99;
        animation: slideDown 0.3s ease;
    }

    .mobile-search-open input {
        width: 100%;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
}

@media (max-width: 768px) {
    .mobile-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        animation: fadeIn 0.3s ease;
    }

    .mobile-menu-dropdown {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 999;
        animation: slideDown 0.3s ease;
        max-height: calc(100vh - 60px);
        overflow-y: auto;
    }

    .mobile-user-section {
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 1.5rem;
        background: var(--bg-secondary);
    }

    .mobile-user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .mobile-user-avatar,
    .mobile-user-avatar-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }

    .mobile-user-avatar-placeholder {
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
    }

    .mobile-user-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .mobile-user-name {
        font-weight: 600;
        font-size: 1rem;
        color: var(--text-primary);
    }

    .mobile-admin-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        background: var(--color-warning);
        color: white;
        border-radius: var(--radius-sm);
        font-weight: 600;
        width: fit-content;
    }

    .mobile-user-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .mobile-user-links a {
        padding: 0.75rem 1rem;
        color: var(--text-primary);
        text-decoration: none;
        font-size: 0.95rem;
        background: var(--bg-card);
        border-radius: var(--radius-md);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .mobile-user-links a .menu-icon {
        flex-shrink: 0;
    }

    .mobile-user-links a:hover {
        background: var(--bg-hover);
        transform: translateX(5px);
    }

    .mobile-logout {
        color: var(--color-danger) !important;
        font-weight: 500;
    }

    .mobile-auth-section {
        padding: 1rem 1.5rem;
        display: flex;
        gap: 0.75rem;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
    }

    .mobile-auth-btn {
        flex: 1;
        padding: 0.75rem 1rem;
        text-align: center;
        color: var(--text-primary);
        text-decoration: none;
        font-weight: 600;
        border-radius: var(--radius-md);
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .mobile-auth-btn.primary {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .mobile-auth-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .mobile-sub-nav {
        display: flex;
        flex-direction: column;
        padding: 0.5rem 0;
    }

    .mobile-sub-nav a {
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        border-bottom: 1px solid var(--border-color);
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mobile-sub-nav a:hover {
        background: var(--bg-hover);
        padding-left: 2rem;
    }

    .dropdown-icon {
        opacity: 0.5;
    }

    .mobile-theme-toggle {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid var(--border-color);
        background: var(--bg-secondary);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .main-header {
        position: relative;
    }

    .navbar {
        padding: 0.5rem 1rem;
        position: relative;
    }

    .nav-left {
        flex: 1;
        gap: 0.5rem;
    }

    .logo {
        font-size: 1.25rem;
    }

    .logo span {
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .logo-icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        display: inline-block;
        vertical-align: middle;
    }

    .mobile-menu-toggle {
        display: block;
    }

    .nav-right {
        display: none;
    }

    .sub-nav {
        display: none;
    }
}

@media (max-width: 480px) {
    .logo {
        font-size: 1.1rem;
    }

    .nav-right {
        width: 100%;
        max-width: 100%;
        right: -100%;
    }

    .navbar {
        padding: 0.5rem 0.75rem;
    }

    .sub-nav {
        padding: 0.5rem;
    }

    .sub-nav a {
        font-size: 0.85rem;
        padding: 0.4rem 0.6rem;
    }
}
</style>
