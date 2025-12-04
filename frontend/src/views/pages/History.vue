<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-5xl">📚</span>
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800">Lịch Sử Đọc</h1>
                            <p class="text-gray-600">Những truyện bạn đã xem gần đây</p>
                        </div>
                    </div>
                    <button v-if="histories.length > 0" @click="clearAll"
                        class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2">
                        <span>🗑️</span> Xóa tất cả
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="text-red-600 bg-red-50 p-6 rounded-lg inline-block border border-red-200">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="histories.length === 0" class="text-center py-20 animate-slide-up">
                <div class="text-8xl mb-4">📖</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Chưa có lịch sử đọc</h3>
                <p class="text-gray-600 mb-6">Bắt đầu khám phá và đọc truyện ngay!</p>
                <router-link to="/"
                    class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition transform hover:scale-105">
                    Khám phá truyện
                </router-link>
            </div>

            <!-- History List -->
            <div v-else class="space-y-4">
                <div v-for="(item, index) in histories" :key="item.historyId"
                    class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-up border border-purple-100"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <div class="flex flex-col md:flex-row gap-4 p-4">
                        <!-- Cover Image -->
                        <router-link :to="{ name: 'story.detail', params: { slug: item.slug } }" class="flex-shrink-0">
                            <div class="w-full md:w-32 h-48 md:h-40 rounded-lg overflow-hidden group">
                                <img v-if="item.image" :src="getStoryImageUrl(item.image)" :alt="item.name"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div v-else
                                    class="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-4xl">
                                    📖
                                </div>
                            </div>
                        </router-link>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <router-link :to="{ name: 'story.detail', params: { slug: item.slug } }">
                                <h3
                                    class="text-xl font-bold text-gray-800 mb-2 hover:text-purple-600 transition line-clamp-2">
                                    {{ item.name }}
                                </h3>
                            </router-link>

                            <!-- Categories -->
                            <div class="flex flex-wrap gap-2 mb-3">
                                <span v-for="cat in item.categoryDetails?.slice(0, 3)" :key="cat._id"
                                    class="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                                    {{ cat.name }}
                                </span>
                            </div>

                            <!-- Stats -->
                            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <span class="flex items-center gap-1">
                                    📚 {{ item.chapterCount || 0 }} chương
                                </span>
                                <span class="flex items-center gap-1">
                                    👁️ {{ formatViews(item.totalViews) }}
                                </span>
                                <span class="flex items-center gap-1">
                                    ⏰ {{ formatDate(item.lastReadAt) }}
                                </span>
                            </div>

                            <!-- Last Chapter -->
                            <div v-if="item.lastChapter"
                                class="bg-purple-50 rounded-lg p-3 mb-3 border border-purple-200">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm text-gray-600 mb-1">Đọc gần nhất:</div>
                                        <div class="font-semibold text-purple-700">
                                            Chương {{ item.lastChapter.chapterNumber }}: {{ item.lastChapter.title }}
                                        </div>
                                    </div>
                                    <router-link :to="{ name: 'story.detail', params: { slug: item.slug } }"
                                        class="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center gap-2 flex-shrink-0">
                                        <span>▶️</span> Tiếp tục
                                    </router-link>
                                </div>
                            </div>

                            <!-- Description -->
                            <p class="text-gray-700 text-sm line-clamp-2 mb-3">
                                {{ item.description || 'Chưa có mô tả' }}
                            </p>
                        </div>

                        <!-- Actions -->
                        <div class="flex md:flex-col gap-2 flex-shrink-0">
                            <button @click="removeHistory(item._id)"
                                class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition flex items-center justify-center gap-2">
                                <span>🗑️</span> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                        ← Trước
                    </button>
                    
                    <div class="flex gap-2">
                        <button v-for="page in Math.min(totalPages, 5)" :key="page"
                            @click="goToPage(page)"
                            :class="[
                                'px-4 py-2 rounded-lg transition',
                                page === currentPage
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-100 border border-purple-200'
                            ]">
                            {{ page }}
                        </button>
                        <span v-if="totalPages > 5" class="px-4 py-2">...</span>
                        <button v-if="totalPages > 5 && currentPage < totalPages"
                            @click="goToPage(totalPages)"
                            :class="[
                                'px-4 py-2 rounded-lg transition',
                                totalPages === currentPage
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-100 border border-purple-200'
                            ]">
                            {{ totalPages }}
                        </button>
                    </div>

                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                        Sau →
                    </button>
                </div>
            </div>

            <!-- Stats Summary -->
            <div v-if="total > 0"
                class="mt-12 bg-white rounded-xl p-6 shadow-lg animate-slide-up border border-purple-100">
                <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Thống kê</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <div class="text-4xl font-bold text-purple-600">{{ total }}</div>
                        <div class="text-gray-600 mt-1">Truyện đã đọc</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-blue-600">{{ totalChaptersRead }}</div>
                        <div class="text-gray-600 mt-1">Chương đã đọc</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-green-600">{{ uniqueCategories }}</div>
                        <div class="text-gray-600 mt-1">Thể loại</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-orange-600">{{ readingStreak }}</div>
                        <div class="text-gray-600 mt-1">Ngày liên tiếp</div>
                    </div>
                </div>
            </div>
        </div>
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

// Remove history
const removeHistory = async (storyId) => {
    if (!confirm('Bạn có chắc muốn xóa lịch sử này?')) return;

    try {
        await HistoryService.deleteHistory(storyId);
        // Reload current page
        await fetchHistory(currentPage.value);
        alert('✅ Đã xóa lịch sử!');
    } catch (err) {
        console.error('Remove history error:', err);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Clear all history
const clearAll = async () => {
    if (!confirm('Bạn có chắc muốn xóa TẤT CẢ lịch sử đọc?')) return;

    try {
        await HistoryService.clearHistory();
        histories.value = [];
        total.value = 0;
        currentPage.value = 1;
        totalPages.value = 1;
        alert('✅ Đã xóa toàn bộ lịch sử!');
    } catch (err) {
        console.error('Clear history error:', err);
        alert('❌ Có lỗi xảy ra!');
    }
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
        alert('⚠️ Vui lòng đăng nhập để xem lịch sử');
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
</style>
