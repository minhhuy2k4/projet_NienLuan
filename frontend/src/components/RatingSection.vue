<template>
    <div class="rating-section bg-white rounded-xl shadow-lg p-6">
        <!-- Header -->
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>⭐</span> Đánh Giá & Nhận Xét
        </h3>

        <!-- Rating Summary -->
        <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Average Rating -->
            <div
                class="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div class="text-5xl font-bold text-yellow-600 mb-2">
                    {{ averageRating.toFixed(1) }}
                </div>
                <div class="flex justify-center mb-2">
                    <span v-for="star in 5" :key="star" class="text-3xl">
                        {{ star <= Math.round(averageRating) ? '⭐' : '☆' }} </span>
                </div>
                <div class="text-gray-600">
                    {{ totalRatings }} đánh giá
                </div>
            </div>

            <!-- Rating Distribution -->
            <div class="space-y-2">
                <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-3">
                    <span class="w-16 text-sm font-semibold text-gray-700">{{ star }} ⭐</span>
                    <div class="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-yellow-500 transition-all duration-500"
                            :style="{ width: getRatingPercentage(star) + '%' }"></div>
                    </div>
                    <span class="w-12 text-sm text-gray-600 text-right">{{ stats[star] }}</span>
                </div>
            </div>
        </div>

        <!-- User's Rating Form (if logged in) -->
        <div v-if="authStore.isLoggedIn" class="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="font-bold text-gray-800 mb-4">
                {{ userRating ? 'Đánh giá của bạn:' : 'Đánh giá truyện này:' }}
            </h4>

            <!-- Star Selection -->
            <div class="flex items-center gap-4 mb-4">
                <span class="font-semibold text-gray-700">Chọn số sao:</span>
                <div class="flex gap-2">
                    <button v-for="star in 5" :key="star" @click="selectedRating = star" type="button"
                        class="text-4xl transition-transform hover:scale-110 focus:outline-none">
                        {{ star <= selectedRating ? '⭐' : '☆' }} </button>
                </div>
                <span class="text-lg font-bold text-gray-700">{{ selectedRating }}/5</span>
            </div>

            <!-- Comment Input -->
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Nhận xét (tùy chọn):</label>
                <textarea v-model="comment" rows="4" placeholder="Chia sẻ cảm nghĩ của bạn về truyện này..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
            </div>

            <!-- Submit Button -->
            <button @click="submitRating" :disabled="selectedRating === 0 || submitting"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <span>{{ submitting ? '⏳' : '📝' }}</span>
                {{ userRating ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
            </button>

            <!-- Delete Button (if user has rated) -->
            <button v-if="userRating" @click="deleteRating"
                class="ml-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center gap-2">
                <span>🗑️</span> Xóa đánh giá
            </button>
        </div>

        <!-- Login Prompt -->
        <div v-else class="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <p class="text-gray-700 mb-4">Vui lòng đăng nhập để đánh giá truyện này</p>
            <router-link to="/login"
                class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                Đăng nhập
            </router-link>
        </div>

        <!-- Ratings List -->
        <div v-if="ratings.length > 0">
            <h4 class="font-bold text-gray-800 mb-4 text-lg">Các đánh giá khác:</h4>
            <div class="space-y-4">
                <div v-for="rating in ratings" :key="rating._id"
                    class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <!-- Rating Header -->
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-semibold text-gray-800">
                                    {{ rating.user.name || rating.user.email }}
                                </span>
                                <div class="flex">
                                    <span v-for="star in 5" :key="star" class="text-lg">
                                        {{ star <= rating.rating ? '⭐' : '☆' }} </span>
                                </div>
                            </div>
                            <div class="text-sm text-gray-500">
                                {{ formatDate(rating.createdAt) }}
                            </div>
                        </div>
                    </div>

                    <!-- Comment -->
                    <p v-if="rating.comment" class="text-gray-700 italic">
                        "{{ rating.comment }}"
                    </p>
                    <p v-else class="text-gray-400 italic">
                        (Không có nhận xét)
                    </p>
                </div>
            </div>

            <!-- Load More Button -->
            <button v-if="canLoadMore" @click="loadMoreRatings"
                class="mt-4 w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition">
                Xem thêm
            </button>
        </div>

        <!-- No Ratings -->
        <div v-else class="text-center py-12 text-gray-500">
            <div class="text-6xl mb-4">⭐</div>
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import RatingService from '@/services/rating.service';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
    storyId: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
});

const emit = defineEmits(['rating-updated']);

const ratings = ref([]);
const stats = ref(null);
const userRating = ref(null);
const selectedRating = ref(0);
const comment = ref('');
const submitting = ref(false);
const limit = ref(10);
const skip = ref(0);
const canLoadMore = ref(true);

// Get rating percentage for distribution
const getRatingPercentage = (star) => {
    if (!stats.value) return 0;
    const total = Object.values(stats.value).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;
    return (stats.value[star] / total) * 100;
};

// Load user's rating
const loadUserRating = async () => {
    if (!authStore.isLoggedIn) return;

    try {
        const rating = await RatingService.getUserRating(props.storyId);
        if (rating) {
            userRating.value = rating;
            selectedRating.value = rating.rating;
            comment.value = rating.comment || '';
        }
    } catch (err) {
        console.error('Load user rating error:', err);
    }
};

// Load ratings
const loadRatings = async () => {
    try {
        const [ratingsData, statsData] = await Promise.all([
            RatingService.getRatingsByStory(props.storyId, limit.value, skip.value),
            RatingService.getRatingStats(props.storyId)
        ]);

        ratings.value = ratingsData;
        stats.value = statsData;
        canLoadMore.value = ratingsData.length >= limit.value;
    } catch (err) {
        console.error('Load ratings error:', err);
    }
};

// Load more ratings
const loadMoreRatings = async () => {
    try {
        skip.value += limit.value;
        const moreRatings = await RatingService.getRatingsByStory(props.storyId, limit.value, skip.value);
        ratings.value.push(...moreRatings);
        canLoadMore.value = moreRatings.length >= limit.value;
    } catch (err) {
        console.error('Load more ratings error:', err);
    }
};

// Submit rating
const submitRating = async () => {
    if (selectedRating.value === 0) {
        alert('⚠️ Vui lòng chọn số sao');
        return;
    }

    if (!authStore.isLoggedIn) {
        alert('⚠️ Vui lòng đăng nhập để đánh giá');
        router.push('/login');
        return;
    }

    try {
        submitting.value = true;
        await RatingService.addOrUpdateRating(props.storyId, selectedRating.value, comment.value);
        alert('✅ Đánh giá thành công!');

        // Reload ratings
        skip.value = 0;
        await Promise.all([loadUserRating(), loadRatings()]);

        // Emit event to update parent
        emit('rating-updated');
    } catch (err) {
        console.error('Submit rating error:', err);
        alert('❌ Có lỗi xảy ra!');
    } finally {
        submitting.value = false;
    }
};

// Delete rating
const deleteRating = async () => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá của mình?')) return;

    try {
        await RatingService.deleteRating(props.storyId);
        alert('✅ Đã xóa đánh giá!');

        // Reset form
        userRating.value = null;
        selectedRating.value = 0;
        comment.value = '';

        // Reload ratings
        skip.value = 0;
        await loadRatings();

        // Emit event to update parent
        emit('rating-updated');
    } catch (err) {
        console.error('Delete rating error:', err);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Format date
const formatDate = (date) => {
    const now = new Date();
    const ratingDate = new Date(date);
    const diffMs = now - ratingDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return ratingDate.toLocaleDateString('vi-VN');
};

onMounted(async () => {
    await Promise.all([loadUserRating(), loadRatings()]);
});
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
