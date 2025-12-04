<template>
    <div class="page-gradient" style="padding: 3rem 0;">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <svg class="w-12 h-12 page-header-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <div>
                            <h1 class="page-title">Lịch Sử Đọc</h1>
                            <p class="page-subtitle">Những truyện bạn đã xem gần đây</p>
                        </div>
                    </div>
                    <button v-if="histories.length > 0" @click="clearAll" class="btn-action-danger">
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
            <div v-else-if="histories.length === 0" class="empty-state animate-slide-up">
                <svg class="empty-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 class="empty-title">Chưa có lịch sử đọc</h3>
                <p class="empty-description">Bắt đầu khám phá và đọc truyện ngay!</p>
                <router-link to="/" class="btn-action-primary">
                    Khám phá truyện
                </router-link>
            </div>

            <!-- History List -->
            <div v-else class="space-y-4">
                <div v-for="(item, index) in histories" :key="item.historyId"
                    class="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-up"
                    style="background-color: var(--bg-card); border: 1px solid var(--border-color);"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <div class="flex flex-col md:flex-row gap-4 p-4">
                        <!-- Cover Image -->
                        <router-link :to="{ name: 'story.detail', params: { slug: item.slug } }" class="flex-shrink-0">
                            <div class="w-full md:w-32 h-48 md:h-40 rounded-lg overflow-hidden group">
                                <img v-if="item.image" :src="getStoryImageUrl(item.image)" :alt="item.name"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div class="w-full h-full flex items-center justify-center text-white text-4xl"
                                    style="background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid));">
                                    <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                        </router-link>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <router-link :to="{ name: 'story.detail', params: { slug: item.slug } }">
                                <h3 class="text-xl font-bold mb-2 transition line-clamp-2"
                                    style="color: var(--text-primary);"
                                    @mouseover="$event.target.style.color = 'var(--color-primary)'"
                                    @mouseleave="$event.target.style.color = 'var(--text-primary)'">
                                    {{ item.name }}
                                </h3>
                            </router-link>

                            <!-- Categories -->
                            <div class="flex flex-wrap gap-2 mb-3">
                                <span v-for="cat in item.categoryDetails?.slice(0, 3)" :key="cat._id"
                                    class="category-badge">
                                    {{ cat.name }}
                                </span>
                            </div>

                            <!-- Stats -->
                            <div class="flex flex-wrap items-center gap-4 text-sm mb-3"
                                style="color: var(--text-secondary);">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                    {{ item.chapterCount || 0 }} chương
                                </span>
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ formatViews(item.totalViews) }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ formatDate(item.lastReadAt) }}
                                </span>
                            </div>

                            <!-- Last Chapter -->
                            <div v-if="item.lastChapter" class="rounded-lg p-3 mb-3"
                                style="background-color: var(--bg-secondary); border: 1px solid var(--color-accent);">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm mb-1" style="color: var(--text-secondary);">Đọc gần nhất:
                                        </div>
                                        <div class="font-semibold" style="color: var(--color-accent);">
                                            Chương {{ item.lastChapter.chapterNumber }}: {{ item.lastChapter.title }}
                                        </div>
                                    </div>
                                    <router-link v-if="item.lastChapter?.chapterNumber"
                                        :to="{ name: 'chapter.detail', params: { storySlug: item.slug, chapterNumber: item.lastChapter.chapterNumber } }"
                                        class="btn-action-primary" style="margin-left: 1rem; flex-shrink: 0;">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Tiếp tục
                                    </router-link>
                                </div>
                            </div>

                            <!-- Description -->
                            <p class="text-sm line-clamp-2 mb-3" style="color: var(--text-secondary);">
                                {{ item.description || 'Chưa có mô tả' }}
                            </p>
                        </div>

                        <!-- Actions -->
                        <div class="flex md:flex-col gap-2 flex-shrink-0">
                            <button @click="removeHistory(item._id)"
                                class="btn-action-danger px-4 py-2 flex items-center justify-center gap-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                Xóa
                            </button>
                        </div>
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
            <div v-if="total > 0" class="mt-12 rounded-xl p-6 shadow-lg animate-slide-up"
                style="background-color: var(--bg-card); border: 1px solid var(--border-color);">
                <h3 class="text-xl font-bold mb-4 text-center" style="color: var(--text-primary);">Thống kê</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <div class="text-4xl font-bold" style="color: var(--color-accent);">{{ total }}</div>
                        <div class="mt-1" style="color: var(--text-secondary);">Truyện đã đọc</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold" style="color: var(--color-primary);">{{ totalChaptersRead }}
                        </div>
                        <div class="mt-1" style="color: var(--text-secondary);">Chương đã đọc</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold" style="color: var(--color-success);">{{ uniqueCategories }}
                        </div>
                        <div class="mt-1" style="color: var(--text-secondary);">Thể loại</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold" style="color: var(--color-warning);">{{ readingStreak }}</div>
                        <div class="mt-1" style="color: var(--text-secondary);">Ngày liên tiếp</div>
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
import HistoryService from '@/services/history.service';
import { useAuthStore } from '@/stores/auth.store';
import { getStoryImageUrl } from '@/utils/media';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const histories = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 10;

// Dialog state
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const dialogConfirmText = ref('Xác nhận');
const dialogType = ref('warning');
const dialogCallback = ref(null);

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// Format views
const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Computed stats
const totalChaptersRead = computed(() => {
    return histories.value.reduce((sum, item) => sum + (item.chapterCount || 0), 0);
});

const uniqueCategories = computed(() => {
    const allCategories = new Set();
    histories.value.forEach(item => {
        item.categoryDetails?.forEach(cat => allCategories.add(cat._id));
    });
    return allCategories.size;
});

const readingStreak = computed(() => {
    // Simple calculation: số ngày khác nhau đã đọc trong 7 ngày qua
    const dates = new Set();
    const now = new Date();
    histories.value.forEach(item => {
        const readDate = new Date(item.lastReadAt);
        const diffDays = Math.floor((now - readDate) / 86400000);
        if (diffDays < 7) {
            dates.add(readDate.toDateString());
        }
    });
    return dates.size;
});

// Fetch history
const fetchHistory = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
        const result = await HistoryService.getHistory(page, limit);
        histories.value = result.histories || [];
        total.value = result.total || 0;
        currentPage.value = result.page || 1;
        totalPages.value = result.totalPages || 1;
        console.log('History loaded:', result);
    } catch (err) {
        console.error('Fetch history error:', err);
        error.value = 'Không thể tải lịch sử đọc';
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

// Remove history
const removeHistory = async (storyId) => {
    openDialog(
        'Xác nhận xóa lịch sử',
        'Bạn có chắc muốn xóa lịch sử này?',
        async () => {
            try {
                await HistoryService.deleteHistory(storyId);
                await fetchHistory(currentPage.value);
                showToastMessage('Đã xóa lịch sử!', 'success');
            } catch (err) {
                console.error('Remove history error:', err);
                showToastMessage('Có lỗi xảy ra!', 'error');
            }
        },
        'warning',
        'Xóa'
    );
};

// Clear all history
const clearAll = async () => {
    openDialog(
        'Xóa tất cả lịch sử',
        'Bạn có chắc muốn xóa TẤT CẢ lịch sử đọc? Hành động này không thể hoàn tác.',
        async () => {
            try {
                await HistoryService.clearHistory();
                histories.value = [];
                total.value = 0;
                currentPage.value = 1;
                totalPages.value = 1;
                showToastMessage('Đã xóa toàn bộ lịch sử!', 'success');
            } catch (err) {
                console.error('Clear history error:', err);
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
    fetchHistory(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch route query for page changes
watch(() => route.query.page, (newPage) => {
    const page = parseInt(newPage) || 1;
    if (page !== currentPage.value) {
        fetchHistory(page);
    }
}, { immediate: false });

// Initial load
onMounted(async () => {
    // Kiểm tra đăng nhập
    if (!authStore.isLoggedIn) {
        alert('Vui lòng đăng nhập để xem lịch sử');
        router.push('/login');
        return;
    }

    const page = parseInt(route.query.page) || 1;
    await fetchHistory(page);
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

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
