<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-red-600 text-xl bg-red-50 p-8 rounded-lg border border-red-200">{{ error }}</div>
        </div>

        <!-- Story Content -->
        <div v-else-if="story" class="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <!-- Breadcrumb -->
            <nav class="text-sm mb-6 animate-fade-in">
                <router-link to="/" class="text-gray-600 hover:text-blue-600 transition">Trang chủ</router-link>
                <span class="text-gray-400 mx-2">/</span>
                <span class="text-gray-800 font-semibold">{{ story.name }}</span>
            </nav>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Story Info -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Cover Image -->
                    <div class="animate-slide-up">
                        <img v-if="story.image" :src="story.image" :alt="story.name"
                            class="w-full rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 border-2 border-blue-100" />
                        <div v-else
                            class="w-full aspect-[3/4] bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-6xl shadow-xl">
                            📖
                        </div>
                    </div>

                    <!-- Rating & Stats -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-lg animate-slide-up animation-delay-100 border border-blue-100">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="flex gap-1">
                                <span v-for="i in 5" :key="i" class="text-2xl">
                                    {{ i <= Math.round(story.averageRating || 0) ? '⭐' : '☆' }} </span>
                            </div>
                            <span class="text-gray-800 text-xl font-bold">{{ (story.averageRating || 0).toFixed(1)
                            }}</span>
                            <span class="text-gray-600 text-sm">({{ story.totalRatings || 0 }} đánh giá)</span>
                        </div>

                        <!-- Category List -->
                        <div class="space-y-2">
                            <span class="text-gray-600 font-semibold block mb-2">Thể loại:</span>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="cat in story.categoryDetails" :key="cat._id"
                                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition cursor-pointer border border-blue-200">
                                    {{ cat.name }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Info Details -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-lg animate-slide-up animation-delay-200 border border-blue-100">
                        <h3 class="text-gray-800 font-bold text-lg mb-4 border-b border-blue-100 pb-2">Thông tin:</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tình trạng:</span>
                                <span class="text-green-600 font-semibold">Đang tiến hành</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Cập nhật:</span>
                                <span class="text-gray-800">{{ formatDate(story.updatedAt) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tác giả:</span>
                                <span class="text-gray-800">{{ getAuthors() }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Lượt xem:</span>
                                <span class="text-blue-600 font-semibold">{{ formatViews(story.totalViews) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Description & Chapters -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Story Title -->
                    <div class="animate-slide-up">
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{{ story.name }}</h1>
                    </div>

                    <!-- Description -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-lg animate-slide-up animation-delay-100 border border-blue-100">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">Truyện {{ story.name }}</h2>
                        <div class="text-gray-700 leading-relaxed mb-4">
                            <p>{{ story.description || 'Truyện này chưa có mô tả.' }}</p>
                            <button class="text-blue-600 hover:text-blue-700 mt-2 transition font-medium">Đọc
                                thêm</button>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-4 mt-6">
                            <router-link v-if="story.chapters && story.chapters.length > 0"
                                :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: story.chapters[0].chapterNumber || 1 } }"
                                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md">
                                <span class="text-xl">▶️</span> CHƯƠNG ĐẦU
                            </router-link>
                            <router-link v-if="story.chapters && story.chapters.length > 0"
                                :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: story.chapters[story.chapters.length - 1].chapterNumber || story.chapters.length } }"
                                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md">
                                <span class="text-xl">📖</span> CHƯƠNG CUỐI
                            </router-link>
                            <button @click="toggleFavorite"
                                class="px-6 py-3 font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md"
                                :class="isFavorite
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'">
                                <span class="text-xl">{{ isFavorite ? '❤️' : '🤍' }}</span>
                                {{ isFavorite ? 'Đã yêu thích' : 'Yêu thích' }}
                            </button>
                        </div>
                    </div>

                    <!-- Chapters List -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-lg animate-slide-up animation-delay-200 border border-blue-100">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b border-blue-100 pb-3">
                            DANH SÁCH CHƯƠNG
                        </h2>

                        <div v-if="story.chapters && story.chapters.length > 0" class="space-y-3">
                            <div v-for="(chapter, index) in story.chapters" :key="chapter._id"
                                class="group relative overflow-hidden rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 cursor-pointer animate-chapter-in border border-blue-200"
                                :class="{ 'ring-2 ring-blue-500 bg-blue-100': currentChapter?._id === chapter._id }"
                                :style="{ animationDelay: `${index * 50}ms` }">
                                <!-- Click to go to chapter detail -->
                                <router-link
                                    :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: chapter.chapterNumber || (index + 1) } }"
                                    class="block p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3">
                                                <span class="text-blue-600 font-bold">Chương {{ chapter.chapterNumber ||
                                                    (index + 1)
                                                }}</span>
                                                <span class="text-gray-800 group-hover:text-blue-700 transition">{{
                                                    chapter.title }}</span>
                                            </div>
                                            <div class="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                                <span>👁️ {{ chapter.views || 0 }}</span>
                                                <span>📅 {{ formatDate(chapter.createdAt) }}</span>
                                                <span v-if="chapter.audioUrl" class="text-green-600">🎵 Có audio</span>
                                            </div>
                                        </div>

                                        <button v-if="chapter.audioUrl" @click.prevent.stop="playChapter(chapter)"
                                            class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
                                            :class="isPlaying && currentChapter?._id === chapter._id
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-blue-600 hover:bg-blue-700'">
                                            <span class="text-white text-xl">
                                                {{ isPlaying && currentChapter?._id === chapter._id ? '⏸️' : '▶️' }}
                                            </span>
                                        </button>
                                        <span v-else class="text-gray-400 text-sm">Chưa có audio</span>
                                    </div>
                                </router-link>

                                <!-- Progress bar for playing chapter -->
                                <div v-if="currentChapter?._id === chapter._id && isPlaying"
                                    class="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-300"
                                    :style="{ width: playProgress + '%' }"></div>
                            </div>
                        </div>
                        <div v-else class="text-center text-gray-500 py-8">
                            Chưa có chương nào
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rating Section -->
            <div class="mt-8 animate-slide-up animation-delay-400">
                <RatingSection :storyId="story?._id" :averageRating="story?.averageRating || 0"
                    :totalRatings="story?.totalRatings || 0" @rating-updated="reloadStory" />
            </div>
        </div>

        <!-- Sticky Audio Player -->
        <transition name="slide-up">
            <div v-if="currentChapter && currentChapter.audioUrl"
                class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-200 shadow-2xl z-50">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex flex-col md:flex-row items-center gap-4">
                        <div class="flex items-center gap-4 flex-1">
                            <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-blue-200">
                                <img v-if="story.image" :src="story.image" :alt="story.name"
                                    class="w-full h-full object-cover" />
                                <div v-else
                                    class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl">
                                    📖
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-gray-800 font-semibold truncate">{{ currentChapter.title }}</h4>
                                <p class="text-gray-600 text-sm">Chương {{ currentChapter.chapterNumber }}</p>
                            </div>
                        </div>

                        <audio ref="audioPlayer" :src="currentChapter.audioUrl" controls @play="isPlaying = true"
                            @pause="isPlaying = false" @ended="onAudioEnded" @timeupdate="updateProgress"
                            class="w-full md:w-auto md:flex-1 max-w-2xl h-12"></audio>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StoryService from '@/services/story.service';
import ChapterService from '@/services/chapter.service';
import FavoriteService from '@/services/favorite.service';
import HistoryService from '@/services/history.service';
import RatingSection from '@/components/RatingSection.vue';
import { useAuthStore } from '@/stores/auth.store';
// Không cần slug utils - dùng story.slug từ API

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
    slug: { type: String, required: true }
});

const story = ref(null);
const loading = ref(true);
const error = ref(null);
const currentChapter = ref(null);
const isPlaying = ref(false);
const audioPlayer = ref(null);
const playProgress = ref(0);
const isFavorite = ref(false);

// Hàm format ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Hàm format lượt xem
const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Lấy tên tác giả
const getAuthors = () => {
    if (!story.value?.authorDetails || story.value.authorDetails.length === 0) {
        return 'Không xác định';
    }
    return story.value.authorDetails.map(author => author.fullName).join(', ');
};

// Phát chương audio
const playChapter = async (chapter) => {
    if (!chapter.audioUrl) {
        alert('Chương này chưa có audio');
        return;
    }

    if (currentChapter.value?._id === chapter._id && isPlaying.value) {
        // Pause current chapter
        audioPlayer.value?.pause();
    } else {
        // Play new chapter
        currentChapter.value = chapter;

        // Lưu lịch sử với chapter cụ thể
        saveHistory(chapter._id);

        // Gọi API để tăng view count của chapter
        try {
            await ChapterService.get(chapter._id);
        } catch (err) {
            console.error('Error incrementing chapter view:', err);
        }

        setTimeout(() => {
            audioPlayer.value?.play();
        }, 100);
    }
};

// Update progress bar
const updateProgress = () => {
    if (audioPlayer.value) {
        const progress = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
        playProgress.value = progress || 0;
    }
};

// Khi audio kết thúc, tự động chuyển chương tiếp theo
const onAudioEnded = () => {
    const currentIndex = story.value.chapters.findIndex(c => c._id === currentChapter.value._id);
    if (currentIndex < story.value.chapters.length - 1) {
        const nextChapter = story.value.chapters[currentIndex + 1];
        if (nextChapter.audioUrl) {
            playChapter(nextChapter);
        }
    }
};

// Toggle yêu thích
const toggleFavorite = async () => {
    if (!authStore.isLoggedIn) {
        alert('⚠️ Vui lòng đăng nhập để thêm vào yêu thích');
        router.push('/login');
        return;
    }

    try {
        const result = await FavoriteService.toggleFavorite(story.value._id);
        isFavorite.value = result.isFavorite;

        if (isFavorite.value) {
            alert('❤️ Đã thêm vào yêu thích!');
        } else {
            alert('💔 Đã xóa khỏi yêu thích!');
        }
    } catch (err) {
        console.error('Toggle favorite error:', err);
        alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
    }
};

// Kiểm tra trạng thái yêu thích
const checkFavoriteStatus = async () => {
    if (authStore.isLoggedIn) {
        try {
            const result = await FavoriteService.checkFavorite(story.value._id);
            isFavorite.value = result.isFavorite;
        } catch (err) {
            console.error('Check favorite error:', err);
        }
    }
};

// Lưu lịch sử đọc
const saveHistory = async (chapterId = null) => {
    if (authStore.isLoggedIn) {
        try {
            await HistoryService.addHistory(story.value._id, chapterId);
            console.log('History saved');
        } catch (err) {
            console.error('Save history error:', err);
        }
    }
};

// Reload story data (e.g., after rating update)
const reloadStory = async () => {
    try {
        story.value = await StoryService.getBySlug(props.slug);
    } catch (err) {
        console.error('Reload story error:', err);
    }
};

onMounted(async () => {
    try {
        story.value = await StoryService.getBySlug(props.slug);
        console.log('Story loaded:', story.value);

        // Kiểm tra trạng thái yêu thích
        await checkFavoriteStatus();

        // Lưu vào lịch sử (không có chapter cụ thể)
        await saveHistory();
    } catch (err) {
        error.value = 'Không tìm thấy truyện này.';
        console.error(err);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Animations */
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

@keyframes chapter-in {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
    animation: slide-up 0.8s ease-out;
}

.animate-chapter-in {
    animation: chapter-in 0.5s ease-out;
}

.animation-delay-100 {
    animation-delay: 100ms;
}

.animation-delay-200 {
    animation-delay: 200ms;
}

.animation-delay-300 {
    animation-delay: 300ms;
}

/* Slide up transition for audio player */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #e2e8f0;
}

::-webkit-scrollbar-thumb {
    background: #3b82f6;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
}
</style>
