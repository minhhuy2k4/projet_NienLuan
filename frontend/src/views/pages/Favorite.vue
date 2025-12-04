<template>
    <div class="page-gradient" style="padding: 3rem 0;">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <svg class="w-12 h-12 page-header-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clip-rule="evenodd" />
                        </svg>
                        <div>
                            <h1 class="page-title">Truyện Yêu Thích</h1>
                            <p class="page-subtitle">Những truyện mà bạn đã đánh dấu yêu thích</p>
                        </div>
                    </div>
                    <button v-if="favorites.length > 0" @click="clearAllFavorites" class="btn-action-danger">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                        Xóa tất cả
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="loading-spinner"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="p-6 rounded-lg inline-block border"
                    style="color: var(--color-danger); background-color: var(--bg-secondary); border-color: var(--border-color);">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="favorites.length === 0" class="empty-state animate-slide-up">
                <svg class="empty-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd" />
                </svg>
                <h3 class="empty-title">Chưa có truyện yêu thích</h3>
                <p class="empty-description">Hãy khám phá và thêm những truyện bạn yêu thích vào danh sách!</p>
                <router-link to="/" class="btn-action-primary">
                    Khám phá truyện
                </router-link>
            </div>

            <!-- Favorites Grid -->
            <div v-else>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
                    <div v-for="(story, index) in favorites" :key="story._id" class="relative animate-slide-up"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <StoryCard :story="story" />
                        <!-- Remove Button Overlay -->
                        <button @click="removeFavorite(story._id)"
                            class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 z-10"
                            style="background-color: var(--color-danger); color: white;" title="Bỏ yêu thích">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn">
                        ← Trước
                    </button>

                    <div class="flex gap-2">
                        <button v-for="page in Math.min(totalPages, 5)" :key="page" @click="goToPage(page)"
                            :class="['pagination-number', { active: page === currentPage }]">
                            {{ page }}
                        </button>
                        <span v-if="totalPages > 5" class="px-4 py-2">...</span>
                        <button v-if="totalPages > 5 && currentPage < totalPages" @click="goToPage(totalPages)"
                            :class="['pagination-number', { active: totalPages === currentPage }]">
                            {{ totalPages }}
                        </button>
                    </div>

                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="pagination-btn">
                        Sau →
                    </button>
                </div>
            </div>

            <!-- Stats Summary -->
            <div v-if="total > 0" class="mt-12 animate-slide-up">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="stat-card">
                        <div class="stat-value">{{ total }}</div>
                        <div class="stat-label">Truyện yêu thích</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{{ totalChapters }}</div>
                        <div class="stat-label">Tổng số chương</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{{ uniqueCategories }}</div>
                        <div class="stat-label">Thể loại khác nhau</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Confirm Dialog -->
        <Teleport to="body">
            <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
                <div class="dialog-content" @click.stop>
                    <div class="dialog-header">
                        <div class="dialog-icon" :class="dialogType === 'danger' ? 'danger' : 'warning'">
                            <svg v-if="dialogType === 'danger'" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="dialog-title">{{ dialogTitle }}</h3>
                        <p class="dialog-message">{{ dialogMessage }}</p>
                    </div>
                    <div class="dialog-actions">
                        <button @click="closeDialog" class="dialog-btn dialog-btn-cancel">
                            Hủy
                        </button>
                        <button @click="confirmDialog" class="dialog-btn dialog-btn-confirm"
                            :class="dialogType === 'danger' ? 'danger' : 'warning'">
                            {{ dialogConfirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Success/Error Toast -->
        <Teleport to="body">
            <Transition name="toast">
                <div v-if="showToast" class="toast" :class="toastType">
                    <svg v-if="toastType === 'success'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    <span>{{ toastMessage }}</span>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FavoriteService from '@/services/favorite.service';
import { useAuthStore } from '@/stores/auth.store';
import StoryCard from '@/components/StoryCard.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const favorites = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 12;

// Dialog state
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const dialogConfirmText = ref('Xác nhận');
const dialogType = ref('warning'); // 'warning' or 'danger'
const dialogCallback = ref(null);

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success'); // 'success' or 'error'

// Computed stats
const totalChapters = computed(() => {
    return favorites.value.reduce((sum, story) => sum + (story.chapterCount || 0), 0);
});

const uniqueCategories = computed(() => {
    const allCategories = new Set();
    favorites.value.forEach(story => {
        story.categoryDetails?.forEach(cat => allCategories.add(cat._id));
    });
    return allCategories.size;
});

// Fetch favorites
const fetchFavorites = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
        const result = await FavoriteService.getFavorites(page, limit);
        favorites.value = result.favorites || [];
        total.value = result.total || 0;
        currentPage.value = result.page || 1;
        totalPages.value = result.totalPages || 1;
        console.log('Favorites loaded:', result);
    } catch (err) {
        console.error('Fetch favorites error:', err);
        error.value = 'Không thể tải danh sách yêu thích';
    } finally {
        loading.value = false;
    }
};

// Dialog helpers
const openDialog = (title, message, callback, type = 'warning', confirmText = 'Xác nhận') => {
    dialogTitle.value = title;
    dialogMessage.value = message;
    dialogCallback.value = callback;
    dialogType.value = type;
    dialogConfirmText.value = confirmText;
    showDialog.value = true;
};

const closeDialog = () => {
    showDialog.value = false;
    dialogCallback.value = null;
};

const confirmDialog = async () => {
    if (dialogCallback.value) {
        await dialogCallback.value();
    }
    closeDialog();
};

// Toast helper
const showToastMessage = (message, type = 'success') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

// Remove favorite
const removeFavorite = async (storyId) => {
    openDialog(
        'Xác nhận bỏ yêu thích',
        'Bạn có chắc muốn bỏ yêu thích truyện này?',
        async () => {
            try {
                await FavoriteService.removeFavorite(storyId);
                await fetchFavorites(currentPage.value);
                showToastMessage('Đã bỏ yêu thích!', 'success');
            } catch (err) {
                console.error('Remove favorite error:', err);
                showToastMessage('Có lỗi xảy ra!', 'error');
            }
        },
        'warning',
        'Bỏ yêu thích'
    );
};

// Clear all favorites
const clearAllFavorites = async () => {
    openDialog(
        'Xóa tất cả yêu thích',
        'Bạn có chắc muốn xóa TẤT CẢ truyện yêu thích? Hành động này không thể hoàn tác.',
        async () => {
            try {
                await FavoriteService.clearAllFavorites();
                favorites.value = [];
                total.value = 0;
                currentPage.value = 1;
                totalPages.value = 1;
                showToastMessage('Đã xóa toàn bộ yêu thích!', 'success');
            } catch (err) {
                console.error('Clear all favorites error:', err);
                showToastMessage('Có lỗi xảy ra!', 'error');
            }
        },
        'danger',
        'Xóa tất cả'
    );
};

// Pagination
const goToPage = (page) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return;
    currentPage.value = page;
    fetchFavorites(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch route query for page changes
watch(() => route.query.page, (newPage) => {
    const page = parseInt(newPage) || 1;
    if (page !== currentPage.value) {
        fetchFavorites(page);
    }
}, { immediate: false });

// Initial load
onMounted(async () => {
    // Kiểm tra đăng nhập
    if (!authStore.isLoggedIn) {
        alert('Vui lòng đăng nhập để xem truyện yêu thích');
        router.push('/login');
        return;
    }

    const page = parseInt(route.query.page) || 1;
    await fetchFavorites(page);
});
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
    animation: slide-up 0.8s ease-out;
}

/* Dialog Styles */
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fade-in 0.2s ease-out;
}

.dialog-content {
    background: var(--bg-card);
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
    overflow: hidden;
    animation: scale-up 0.3s ease-out;
}

@keyframes scale-up {
    from {
        transform: scale(0.9);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.dialog-header {
    padding: 2rem;
    text-align: center;
}

.dialog-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog-icon.warning {
    background: rgba(251, 191, 36, 0.2);
    color: var(--color-warning);
}

.dialog-icon.danger {
    background: rgba(239, 68, 68, 0.2);
    color: var(--color-danger);
}

.dialog-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.dialog-message {
    color: var(--text-secondary);
    line-height: 1.6;
}

.dialog-actions {
    display: flex;
    gap: 0.75rem;
    padding: 0 2rem 2rem;
}

.dialog-btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.dialog-btn-cancel {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.dialog-btn-cancel:hover {
    background: var(--bg-hover);
}

.dialog-btn-confirm {
    color: white;
}

.dialog-btn-confirm.warning {
    background: var(--color-warning);
}

.dialog-btn-confirm.warning:hover {
    background: #f59e0b;
}

.dialog-btn-confirm.danger {
    background: var(--color-danger);
}

.dialog-btn-confirm.danger:hover {
    background: #dc2626;
}

/* Toast Styles */
.toast {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--bg-card);
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 10000;
    min-width: 300px;
    border-left: 4px solid;
}

.toast.success {
    border-color: var(--color-success);
    color: var(--color-success);
}

.toast.error {
    border-color: var(--color-danger);
    color: var(--color-danger);
}

.toast span {
    color: var(--text-primary);
    font-weight: 500;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
