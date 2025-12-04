<template>
    <div class="rating-section rounded-xl shadow-lg p-6 sm:p-8" style="background-color: var(--bg-card);">
        <!-- Header -->
        <h3 class="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3" style="color: var(--text-primary);">
            <svg class="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                </path>
            </svg>
            <span>Đánh Giá & Nhận Xét</span>
        </h3>

        <!-- Rating Summary -->
        <div v-if="stats" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Average Rating -->
            <div class="flex flex-col items-center justify-center text-center p-6 rounded-xl border"
                style="background-color: var(--bg-secondary); border-color: var(--border-color);">
                <div class="text-6xl font-bold mb-2" style="color: var(--text-primary);">
                    {{ averageRating.toFixed(1) }}
                </div>
                <div class="flex justify-center mb-2">
                    <div v-for="star in 5" :key="star" class="text-3xl"
                        :class="star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'">★</div>
                </div>
                <div class="text-gray-500">
                    Dựa trên {{ totalRatings }} đánh giá
                </div>
            </div>

            <!-- Rating Distribution -->
            <div class="flex flex-col justify-center space-y-2">
                <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-3">
                    <span class="w-16 text-sm font-semibold flex items-center" style="color: var(--text-primary);">{{
                        star }} <span class="text-yellow-400 ml-1">★</span></span>
                    <div class="flex-1 h-4 rounded-full overflow-hidden" style="background-color: var(--bg-secondary);">
                        <div class="h-full bg-yellow-400 transition-all duration-500 rounded-full"
                            :style="{ width: getRatingPercentage(star) + '%' }"></div>
                    </div>
                    <span class="w-12 text-sm text-right font-mono" style="color: var(--text-secondary);">{{ stats[star]
                        }}</span>
                </div>
            </div>
        </div>

        <!-- User's Rating Form (if logged in) -->
        <div v-if="authStore.isLoggedIn" class="mb-8 p-6 rounded-xl border"
            style="background-color: var(--bg-secondary); border-color: var(--border-color);">
            <h4 class="font-bold text-lg mb-4" style="color: var(--text-primary);">
                {{ userRating ? 'Cập nhật đánh giá của bạn:' : 'Bạn nghĩ sao về truyện này?' }}
            </h4>

            <div class="flex items-center gap-4 mb-4">
                <span class="font-semibold" style="color: var(--text-primary);">Chất lượng:</span>
                <div class="flex gap-1" @mouseleave="hoveredRating = 0">
                    <button v-for="star in 5" :key="star" @click="selectedRating = star"
                        @mouseenter="hoveredRating = star" type="button" class="focus:outline-none">
                        <svg class="w-8 h-8 transition-transform hover:scale-110"
                            :class="(star <= (hoveredRating || selectedRating)) ? 'text-yellow-400' : 'text-gray-300'"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="mb-4">
                <textarea v-model="comment" rows="3" placeholder="Viết nhận xét của bạn (tùy chọn)..."
                    class="form-textarea-themed"></textarea>
            </div>

            <div class="flex items-center gap-4">
                <button @click="submitRating" :disabled="selectedRating === 0 || submitting" class="btn-action-primary"
                    :style="{ opacity: (selectedRating === 0 || submitting) ? '0.6' : '1', cursor: (selectedRating === 0 || submitting) ? 'not-allowed' : 'pointer' }">
                    <span v-if="submitting"
                        class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>{{ userRating ? 'Cập nhật' : 'Gửi đánh giá' }}</span>
                </button>

                <button v-if="userRating" @click="deleteRating" class="btn-action-danger">
                    <span>🗑️</span> Xóa
                </button>
            </div>
        </div>

        <!-- Login Prompt -->
        <div v-else class="mb-8 p-6 rounded-xl border text-center"
            style="background-color: var(--bg-secondary); border-color: var(--border-color);">
            <p class="mb-4 font-semibold" style="color: var(--text-primary);">Vui lòng đăng nhập để đánh giá và bình
                luận.</p>
            <router-link to="/login" class="btn-action-primary">
                Đăng nhập ngay
            </router-link>
        </div>

        <!-- Ratings List -->
        <div v-if="ratings.length > 0">
            <h4 class="font-bold text-xl mb-4" style="color: var(--text-primary);">Tất cả nhận xét</h4>
            <div class="space-y-6">
                <div v-for="rating in ratings" :key="rating._id" class="flex items-start space-x-4 p-4"
                    style="border-bottom: 1px solid var(--border-color);">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                            style="background-color: var(--bg-secondary); color: var(--text-primary);">
                            {{ rating.user.name ? rating.user.name.charAt(0).toUpperCase() : 'U' }}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-semibold" style="color: var(--text-primary);">{{ rating.user.name ||
                                    rating.user.email }}</p>
                                <p class="text-sm" style="color: var(--text-secondary);">{{ formatDate(rating.createdAt)
                                    }}</p>
                            </div>
                            <div class="flex">
                                <div v-for="star in 5" :key="star" class="text-lg"
                                    :class="star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'">★</div>
                            </div>
                        </div>
                        <p v-if="rating.comment" class="mt-2 prose prose-sm max-w-none"
                            style="color: var(--text-primary);">{{ rating.comment }}</p>
                    </div>
                </div>
            </div>

            <button v-if="canLoadMore" @click="loadMoreRatings"
                class="mt-6 w-full px-6 py-3 font-semibold rounded-lg transition"
                style="background-color: var(--bg-hover); color: var(--text-primary);">
                Tải thêm nhận xét
            </button>
        </div>

        <div v-else class="text-center py-12" style="color: var(--text-secondary);">
            <div class="text-5xl mb-4">🤔</div>
            <p class="font-semibold">Chưa có đánh giá nào.</p>
            <p>Hãy là người đầu tiên nhận xét về truyện này!</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
const hoveredRating = ref(0);
const comment = ref('');
const submitting = ref(false);
const limit = ref(5);
const skip = ref(0);
const canLoadMore = ref(true);

const getRatingPercentage = (star) => {
    if (!stats.value || !props.totalRatings) return 0;
    return (stats.value[star] / props.totalRatings) * 100;
};

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

const loadRatings = async (reset = false) => {
    try {
        if (reset) {
            skip.value = 0;
            ratings.value = [];
        }
        const [ratingsData, statsData] = await Promise.all([
            RatingService.getRatingsByStory(props.storyId, limit.value, skip.value),
            RatingService.getRatingStats(props.storyId)
        ]);

        ratings.value.push(...ratingsData);
        stats.value = statsData;
        canLoadMore.value = ratingsData.length >= limit.value;
        skip.value += ratingsData.length;
    } catch (err) {
        console.error('Load ratings error:', err);
    }
};

const submitRating = async () => {
    if (selectedRating.value === 0) {
        alert('Vui lòng chọn ít nhất 1 sao để đánh giá.');
        return;
    }
    if (!authStore.isLoggedIn) {
        router.push('/login');
        return;
    }

    submitting.value = true;
    try {
        await RatingService.addOrUpdateRating(props.storyId, selectedRating.value, comment.value);
        await Promise.all([loadUserRating(), loadRatings(true)]);
        emit('rating-updated');
    } catch (err) {
        console.error('Submit rating error:', err);
    } finally {
        submitting.value = false;
    }
};

const deleteRating = async () => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
        await RatingService.deleteRating(props.storyId);
        userRating.value = null;
        selectedRating.value = 0;
        comment.value = '';
        await loadRatings(true);
        emit('rating-updated');
    } catch (err) {
        console.error('Delete rating error:', err);
    }
};

const formatDate = (date) => {
    const now = new Date();
    const ratingDate = new Date(date);
    const diffMs = now - ratingDate;
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.round(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.round(diffMs / 86400000);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return ratingDate.toLocaleDateString('vi-VN');
};

onMounted(() => {
    Promise.all([loadUserRating(), loadRatings(true)]);
});
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.5.x/src/css/typography.css');
</style>