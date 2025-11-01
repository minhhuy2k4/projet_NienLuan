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

        <!-- Chapter Content -->
        <div v-else-if="chapter && story" class="max-w-5xl mx-auto px-4 py-8">
            <!-- Breadcrumb -->
            <nav class="text-sm mb-6 animate-fade-in">
                <router-link to="/" class="text-gray-600 hover:text-blue-600 transition">Trang chủ</router-link>
                <span class="text-gray-400 mx-2">/</span>
                <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                    class="text-gray-600 hover:text-blue-600 transition">
                    {{ story.name }}
                </router-link>
                <span class="text-gray-400 mx-2">/</span>
                <span class="text-gray-800 font-semibold">Chương {{ chapter.chapterNumber }}</span>
            </nav>

            <!-- Chapter Header -->
            <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up border border-blue-100">
                <div class="flex items-start gap-4 mb-6">
                    <!-- Story Cover -->
                    <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                        class="flex-shrink-0 group">
                        <img v-if="story.image" :src="story.image" :alt="story.name"
                            class="w-24 h-32 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform border-2 border-blue-100" />
                        <div v-else
                            class="w-24 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-4xl shadow-md">
                            📖
                        </div>
                    </router-link>

                    <!-- Chapter Info -->
                    <div class="flex-1 min-w-0">
                        <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                            class="text-gray-600 hover:text-blue-600 transition text-sm mb-2 inline-block">
                            ← Quay lại {{ story.name }}
                        </router-link>
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            Chương {{ chapter.chapterNumber }}: {{ chapter.title }}
                        </h1>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div class="flex items-center gap-2">
                                <span>👁️</span>
                                <span>{{ formatViews(chapter.views || 0) }} lượt xem</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span>📅</span>
                                <span>{{ formatDate(chapter.createdAt) }}</span>
                            </div>
                            <div v-if="chapter.updatedAt && chapter.updatedAt !== chapter.createdAt"
                                class="flex items-center gap-2">
                                <span>🔄</span>
                                <span>Cập nhật: {{ formatDate(chapter.updatedAt) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Audio Player (if available) -->
                <div v-if="chapter.audioUrl"
                    class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-2xl">🎵</span>
                        <h3 class="text-lg font-semibold text-gray-800">Audio truyện</h3>
                    </div>
                    <audio ref="audioPlayer" :src="chapter.audioUrl" controls @play="isPlaying = true"
                        @pause="isPlaying = false" @ended="onAudioEnded" @timeupdate="updateProgress"
                        class="w-full h-12 rounded-lg"></audio>

                    <!-- Progress Info -->
                    <div v-if="audioPlayer" class="mt-3 text-sm text-gray-600 flex justify-between">
                        <span>{{ formatTime(currentTime) }}</span>
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                </div>

                <!-- No Audio Message -->
                <div v-else class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <span class="text-4xl mb-2 block">🔇</span>
                    <p class="text-gray-700 font-medium">Chương này chưa có audio</p>
                </div>
            </div>

            <!-- Chapter Description/Content -->
            <div
                class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up animation-delay-100 border border-blue-100">
                <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b border-blue-100 pb-3">
                    📝 Nội dung chương
                </h2>
                <div class="prose max-w-none">
                    <p v-if="chapter.description" class="text-gray-700 leading-relaxed whitespace-pre-line">
                        {{ chapter.description }}
                    </p>
                    <p v-else class="text-gray-500 italic">
                        Chương này chưa có nội dung mô tả.
                    </p>
                </div>
            </div>

            <!-- Chapter Navigation -->
            <div class="bg-white rounded-xl shadow-lg p-6 animate-slide-up animation-delay-200 border border-blue-100">
                <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-blue-100 pb-3">
                    📚 Điều hướng chương
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Previous Chapter -->
                    <button v-if="previousChapter"
                        @click="goToChapter(previousChapter.chapterNumber || (allChapters.indexOf(previousChapter) + 1))"
                        class="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all transform hover:scale-105 border border-blue-200 group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">⬅️</span>
                        <div class="text-left flex-1 min-w-0">
                            <div class="text-xs text-gray-600 mb-1">Chương trước</div>
                            <div class="font-semibold text-gray-800 truncate">
                                Ch.{{ previousChapter.chapterNumber || (allChapters.indexOf(previousChapter) + 1) }}: {{
                                    previousChapter.title }}
                            </div>
                        </div>
                    </button>
                    <div v-else class="p-4 bg-gray-100 rounded-lg text-center text-gray-400 border border-gray-200">
                        <span>⬅️</span>
                        <div class="text-sm mt-1">Không có chương trước</div>
                    </div>

                    <!-- Story List -->
                    <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                        class="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all transform hover:scale-105 border border-purple-200 group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">📑</span>
                        <div class="font-semibold text-gray-800 text-center">Danh sách chương</div>
                    </router-link>

                    <!-- Next Chapter -->
                    <button v-if="nextChapter"
                        @click="goToChapter(nextChapter.chapterNumber || (allChapters.indexOf(nextChapter) + 1))"
                        class="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all transform hover:scale-105 border border-green-200 group">
                        <div class="text-right flex-1 min-w-0">
                            <div class="text-xs text-gray-600 mb-1">Chương tiếp theo</div>
                            <div class="font-semibold text-gray-800 truncate">
                                Ch.{{ nextChapter.chapterNumber || (allChapters.indexOf(nextChapter) + 1) }}: {{
                                    nextChapter.title }}
                            </div>
                        </div>
                        <span class="text-2xl group-hover:scale-110 transition-transform">➡️</span>
                    </button>
                    <div v-else class="p-4 bg-gray-100 rounded-lg text-center text-gray-400 border border-gray-200">
                        <span>➡️</span>
                        <div class="text-sm mt-1">Không có chương tiếp theo</div>
                    </div>
                </div>

                <!-- Auto-play toggle -->
                <div v-if="nextChapter && chapter.audioUrl"
                    class="mt-6 pt-6 border-t border-blue-100 flex items-center justify-center gap-3">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="autoPlayNext"
                            class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                        <span class="text-gray-700 font-medium">🔄 Tự động chuyển chương khi hết audio</span>
                    </label>
                </div>
            </div>

            <!-- Related Chapters -->
            <div v-if="allChapters.length > 0"
                class="mt-6 bg-white rounded-xl shadow-lg p-6 animate-slide-up animation-delay-300 border border-blue-100">
                <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-blue-100 pb-3">
                    📖 Các chương khác
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    <router-link v-for="(ch, index) in allChapters" :key="ch._id"
                        :to="{ name: 'chapter.detail', params: { storySlug: props.storySlug, chapterNumber: ch.chapterNumber || (index + 1) } }"
                        class="p-3 rounded-lg transition-all border-2" :class="ch._id === chapter._id
                            ? 'bg-blue-100 border-blue-500 font-bold'
                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'">
                        <div class="text-sm text-gray-600 mb-1">Chương {{ ch.chapterNumber || (index + 1) }}</div>
                        <div class="text-xs truncate"
                            :class="ch._id === chapter._id ? 'text-blue-700' : 'text-gray-700'">
                            {{ ch.title }}
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Comment Section -->
            <div class="mt-6 animate-slide-up animation-delay-400">
                <CommentSection :chapterId="chapter?._id" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ChapterService from '@/services/chapter.service';
import StoryService from '@/services/story.service';
import HistoryService from '@/services/history.service';
import CommentSection from '@/components/CommentSection.vue';
import { useAuthStore } from '@/stores/auth.store';
// Không cần slug utils - dùng story.slug từ API

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const props = defineProps({
    storySlug: { type: String, required: true },
    chapterNumber: { type: [String, Number], required: true }
});

const chapter = ref(null);
const story = ref(null);
const allChapters = ref([]);
const loading = ref(true);
const error = ref(null);
const audioPlayer = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const autoPlayNext = ref(true);

// Computed properties for navigation
const currentChapterIndex = computed(() => {
    return allChapters.value.findIndex(ch => ch._id === chapter.value?._id);
});

const previousChapter = computed(() => {
    if (currentChapterIndex.value > 0) {
        return allChapters.value[currentChapterIndex.value - 1];
    }
    return null;
});

const nextChapter = computed(() => {
    if (currentChapterIndex.value >= 0 && currentChapterIndex.value < allChapters.value.length - 1) {
        return allChapters.value[currentChapterIndex.value + 1];
    }
    return null;
});

// Format functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Audio player controls
const updateProgress = () => {
    if (audioPlayer.value) {
        currentTime.value = audioPlayer.value.currentTime;
        duration.value = audioPlayer.value.duration;
    }
};

const onAudioEnded = () => {
    if (autoPlayNext.value && nextChapter.value) {
        goToChapter(nextChapter.value.chapterNumber || (allChapters.value.indexOf(nextChapter.value) + 1));
    }
};

// Navigation
const goToChapter = (chapterNumber) => {
    router.push({
        name: 'chapter.detail',
        params: {
            storySlug: props.storySlug,
            chapterNumber
        }
    });
};

// Save history
const saveHistory = async () => {
    if (authStore.isLoggedIn && story.value && chapter.value) {
        try {
            await HistoryService.addHistory(story.value._id, chapter.value._id);
            console.log('History saved');
        } catch (err) {
            console.error('Save history error:', err);
        }
    }
};

// Load chapter data
const loadChapter = async () => {
    try {
        loading.value = true;
        error.value = null;

        // Load story details by slug first
        story.value = await StoryService.getBySlug(props.storySlug);

        // Get all chapters for navigation
        allChapters.value = story.value.chapters || [];

        // Find chapter by chapterNumber
        chapter.value = allChapters.value.find(
            ch => ch.chapterNumber == props.chapterNumber ||
                allChapters.value.indexOf(ch) + 1 == props.chapterNumber
        );

        if (!chapter.value) {
            error.value = `Không tìm thấy chương ${props.chapterNumber}`;
            return;
        }

        // Increment view count
        if (chapter.value._id) {
            await ChapterService.get(chapter.value._id);
        }

        // Save to history
        await saveHistory();

        // Auto-play if there's audio
        if (chapter.value.audioUrl && audioPlayer.value) {
            setTimeout(() => {
                audioPlayer.value?.play();
            }, 500);
        }
    } catch (err) {
        console.error('Load chapter error:', err);
        error.value = 'Không thể tải thông tin chương.';
    } finally {
        loading.value = false;
    }
};

// Watch for route changes
watch(() => [props.storySlug, props.chapterNumber], () => {
    loadChapter();
});

onMounted(() => {
    loadChapter();
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

.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
    animation: slide-up 0.8s ease-out;
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

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #e2e8f0;
}

::-webkit-scrollbar-thumb {
    background: #3b82f6;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
}

/* Prose styles for content */
.prose {
    font-size: 1.125rem;
    line-height: 1.75;
}

.prose p {
    margin-bottom: 1.25rem;
}
</style>
