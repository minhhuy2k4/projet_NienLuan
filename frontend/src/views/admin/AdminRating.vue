<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <svg class="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Quản Lý Đánh Giá
                </h1>
                <p class="text-gray-600">Xem và quản lý đánh giá của người dùng</p>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6 animate-slide-up">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <!-- Search by Story Name -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm theo tên truyện</label>
                        <div class="relative">
                            <input v-model="filters.search" @input="handleFilterChange" type="text"
                                class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên truyện...">
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
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
                                        <svg v-for="star in 5" :key="star" class="w-6 h-6"
                                            :class="star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
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
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>{{ rating.user.name || rating.user.email }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span>{{ rating.user.email }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>{{ formatDate(rating.createdAt) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex-shrink-0">
                                <button @click="deleteRating(rating._id)"
                                    class="px-4 py-2 !bg-red-600 hover:!bg-red-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-6 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                    ← Trước
                </button>
                <div class="px-6 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
                    Trang {{ currentPage }} / {{ totalPages }}
                </div>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-6 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                    Sau →
                </button>
            </div>

            <!-- Displaying info -->
            <div v-if="ratings.length > 0" class="mt-4 text-center text-sm text-gray-600">
                Hiển thị {{ skip + 1 }} - {{ Math.min(skip + limit, totalCount) }} / Tổng {{ totalCount }} đánh giá
            </div>
        </div>

        <!-- Confirm Dialog -->
        <ConfirmDialog v-model="showDialog" :title="dialogConfig.title" :message="dialogConfig.message"
            :type="dialogConfig.type" @confirm="dialogConfig.onConfirm" />

        <!-- Toast Notification -->
        <Toast v-model="showToast" :message="toastConfig.message" :type="toastConfig.type" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import RatingService from '@/services/rating.service';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Toast from '@/components/Toast.vue';
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

// Dialog state
const showDialog = ref(false);
const dialogConfig = ref({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
});

// Toast state
const showToast = ref(false);
const toastConfig = ref({
    message: '',
    type: 'success'
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
    dialogConfig.value = {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc muốn xóa đánh giá này?',
        type: 'danger',
        onConfirm: async () => {
            try {
                await RatingService.deleteRatingById(ratingId);
                toastConfig.value = {
                    message: 'Đã xóa đánh giá!',
                    type: 'success'
                };
                showToast.value = true;
                loadRatings();
            } catch (err) {
                console.error('Delete rating error:', err);
                toastConfig.value = {
                    message: 'Có lỗi xảy ra!',
                    type: 'error'
                };
                showToast.value = true;
            }
        }
    };
    showDialog.value = true;
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
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
