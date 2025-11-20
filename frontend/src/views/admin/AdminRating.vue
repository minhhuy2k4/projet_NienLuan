<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">📊 Quản Lý Đánh Giá</h1>
                <p class="text-gray-600">Xem và quản lý đánh giá của người dùng</p>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6 animate-slide-up">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <!-- Search by Story Name -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm theo tên truyện</label>
                        <input v-model="filters.search" @input="handleFilterChange" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="🔍 Nhập tên truyện...">
                    </div>

                    <!-- Filter by Rating -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Lọc theo sao</label>
                        <select v-model="filters.rating" @change="handleFilterChange"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Tất cả</option>
                            <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                            <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                            <option value="3">⭐⭐⭐ (3 sao)</option>
                            <option value="2">⭐⭐ (2 sao)</option>
                            <option value="1">⭐ (1 sao)</option>
                        </select>
                    </div>

                    <!-- Total Count -->
                    <div class="flex items-end">
                        <div
                            class="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center font-semibold text-blue-700">
                            Tổng: {{ totalCount }} đánh giá
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="text-red-600 bg-red-50 p-6 rounded-lg inline-block border border-red-200">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="ratings.length === 0" class="text-center py-20">
                <div class="text-8xl mb-4">⭐</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Chưa có đánh giá</h3>
                <p class="text-gray-600">Chưa có đánh giá nào phù hợp với bộ lọc</p>
            </div>

            <!-- Ratings List -->
            <div v-else class="space-y-4">
                <div v-for="(rating, index) in ratings" :key="rating._id"
                    class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02] animate-chapter-in"
                    :style="{ animationDelay: `${index * 100}ms` }">
                    <div class="p-6">
                        <div class="flex items-start gap-4">
                            <!-- Story Image -->
                            <div class="flex-shrink-0">
                                <img v-if="rating.story.image" :src="getStoryImageUrl(rating.story.image)"
                                    :alt="rating.story.name" class="w-20 h-28 object-cover rounded-lg" />
                                <div v-else
                                    class="w-20 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-3xl">
                                    📖
                                </div>
                            </div>

                            <!-- Rating Info -->
                            <div class="flex-1 min-w-0">
                                <!-- Story Name -->
                                <router-link :to="{ name: 'story.detail', params: { slug: rating.story.slug } }"
                                    class="text-lg font-bold text-gray-800 hover:text-blue-600 transition line-clamp-1 mb-2">
                                    {{ rating.story.name }}
                                </router-link>

                                <!-- Stars -->
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="flex">
                                        <span v-for="star in 5" :key="star" class="text-2xl">
                                            {{ star <= rating.rating ? '⭐' : '☆' }} </span>
                                    </div>
                                    <span class="text-sm font-semibold text-gray-700">
                                        {{ rating.rating }}/5
                                    </span>
                                </div>

                                <!-- Comment -->
                                <p v-if="rating.comment" class="text-gray-700 mb-3 italic">
                                    "{{ rating.comment }}"
                                </p>
                                <p v-else class="text-gray-400 mb-3 italic">
                                    (Không có nhận xét)
                                </p>

                                <!-- User & Date Info -->
                                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold">👤</span>
                                        <span>{{ rating.user.name || rating.user.email }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold">📧</span>
                                        <span>{{ rating.user.email }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold">📅</span>
                                        <span>{{ formatDate(rating.createdAt) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex-shrink-0">
                                <button @click="deleteRating(rating._id)"
                                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center gap-2">
                                    <span>🗑️</span> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                    ← Trước
                </button>
                <div class="px-6 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
                    Trang {{ currentPage }} / {{ totalPages }}
                </div>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                    Sau →
                </button>
            </div>

            <!-- Displaying info -->
            <div v-if="ratings.length > 0" class="mt-4 text-center text-sm text-gray-600">
                Hiển thị {{ skip + 1 }} - {{ Math.min(skip + limit, totalCount) }} / Tổng {{ totalCount }} đánh giá
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import RatingService from '@/services/rating.service';
import { getStoryImageUrl } from '@/utils/media';

const ratings = ref([]);
const loading = ref(true);
const error = ref(null);
const totalCount = ref(0);
const limit = ref(5);
const skip = ref(0);

const filters = ref({
    rating: '',
    search: ''
});

const currentPage = computed(() => Math.floor(skip.value / limit.value) + 1);
const totalPages = computed(() => Math.ceil(totalCount.value / limit.value));

// Load ratings
const loadRatings = async () => {
    try {
        loading.value = true;
        error.value = null;

        const filterParams = {};
        if (filters.value.rating) filterParams.rating = filters.value.rating;
        if (filters.value.search) filterParams.search = filters.value.search;

        const result = await RatingService.getAllRatings(limit.value, skip.value, filterParams);
        ratings.value = result.ratings;
        totalCount.value = result.totalCount;
    } catch (err) {
        console.error('Load ratings error:', err);
        error.value = 'Không thể tải danh sách đánh giá';
    } finally {
        loading.value = false;
    }
};

// Reset to first page when filter changes
const handleFilterChange = () => {
    skip.value = 0;
    loadRatings();
};

// Delete rating
const deleteRating = async (ratingId) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
        await RatingService.deleteRatingById(ratingId);
        alert('✅ Đã xóa đánh giá!');
        loadRatings();
    } catch (err) {
        console.error('Delete rating error:', err);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Pagination
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        skip.value += limit.value;
        loadRatings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        skip.value = Math.max(0, skip.value - limit.value);
        loadRatings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(async () => {
    await loadRatings();
});
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
