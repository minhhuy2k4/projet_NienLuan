<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-red-600 text-xl bg-red-50 p-8 rounded-lg border border-red-200 shadow-lg">{{ error }}</div>
        </div>

        <!-- Story Content -->
        <div v-else-if="story" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Breadcrumb -->
            <nav class="text-sm mb-8 animate-fade-in">
                <router-link to="/" class="text-gray-500 hover:text-blue-600 transition duration-300">Trang
                    chủ</router-link>
                <span class="text-gray-400 mx-2">/</span>
                <span class="text-gray-800 font-semibold">{{ story.name }}</span>
            </nav>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <!-- Left Column: Story Info -->
                <div class="lg:col-span-4 space-y-6">
                    <!-- Cover Image -->
                    <div class="animate-slide-up">
                        <img v-if="story.image" :src="getStoryImageUrl(story.image)" :alt="story.name"
                            class="w-full rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-white" />
                        <div v-else
                            class="w-full aspect-[3/4] bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-white text-6xl shadow-xl">
                            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Info Details -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-md animate-slide-up animation-delay-200 border border-gray-100">
                        <h3 class="text-gray-800 font-bold text-xl mb-4 border-b border-gray-200 pb-3">Thông tin chi
                            tiết</h3>
                        <div class="space-y-4 text-base">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Tình trạng:
                                </span>
                                <span class="font-semibold px-3 py-1 rounded-full text-sm" :class="statusDisplay.class">
                                    {{ story.status }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Cập nhật:
                                </span>
                                <span class="text-gray-800 font-medium">{{ formatDate(story.updatedAt) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path
                                            d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fill-rule="evenodd"
                                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Tác giả:
                                </span>
                                <span class="text-gray-800 font-medium">{{ getAuthors() }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Lượt xem:
                                </span>
                                <span class="text-blue-600 font-bold">{{ formatViews(story.totalViews) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Description & Chapters -->
                <div class="lg:col-span-8 space-y-8">
                    <!-- Story Title & Rating -->
                    <div class="animate-slide-up">
                        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{{ story.name }}</h1>
                        <div class="flex items-center gap-3">
                            <div class="flex gap-1">
                                <span v-for="i in 5" :key="i" class="text-2xl"
                                    :class="i <= Math.round(story.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'">
                                    ★
                                </span>
                            </div>
                            <span class="text-gray-800 text-xl font-bold">{{ (story.averageRating || 0).toFixed(1)
                            }}</span>
                            <span class="text-gray-500 text-sm">/ {{ story.totalRatings || 0 }} đánh giá</span>
                        </div>
                    </div>

                    <!-- Description & Actions -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-md animate-slide-up animation-delay-100 border border-gray-100">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">Giới thiệu truyện</h2>
                        <div class="text-gray-700 leading-relaxed mb-4 prose max-w-none">
                            <p>{{ truncatedDescription }}</p>
                        </div>
                        <button v-if="story.description && story.description.length > 250" @click="toggleDescription"
                            class="text-blue-600 hover:text-blue-800 transition font-semibold text-sm">
                            {{ isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm' }}
                        </button>

                        <!-- Category List -->
                        <div class="mt-6 pt-4 border-t border-gray-200">
                            <span class="text-gray-500 font-semibold block mb-3">Thể loại:</span>
                            <div class="flex flex-wrap gap-2">
                                <router-link v-for="cat in story.categoryDetails" :key="cat._id"
                                    :to="`/category/${cat.slug}`"
                                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300 border border-gray-200">
                                    {{ cat.name }}
                                </router-link>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-4 mt-6">
                            <router-link v-if="story.chapters && story.chapters.length > 0"
                                :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: story.chapters[0].chapterNumber || 1 } }"
                                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clip-rule="evenodd" />
                                </svg>
                                Đọc từ đầu
                            </router-link>
                            <router-link v-if="story.chapters && story.chapters.length > 0"
                                :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: story.chapters[story.chapters.length - 1].chapterNumber || story.chapters.length } }"
                                class="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                Đọc mới nhất
                            </router-link>
                            <button @click="toggleFavorite"
                                class="px-6 py-3 font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md"
                                :class="isFavorite
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-white hover:bg-red-50 text-red-500 border border-red-200'">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path v-if="isFavorite" fill-rule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clip-rule="evenodd" />
                                    <path v-else
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        fill="none" stroke="currentColor" stroke-width="2" />
                                </svg>
                                {{ isFavorite ? 'Đã thích' : 'Yêu thích' }}
                            </button>
                        </div>
                    </div>

                    <!-- Chapters List -->
                    <div
                        class="bg-white rounded-xl shadow-md animate-slide-up animation-delay-200 border border-gray-100">
                        <h2 class="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">
                            Danh sách chương
                        </h2>

                        <div v-if="story.chapters && story.chapters.length > 0"
                            class="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <div v-for="(chapter, index) in story.chapters" :key="chapter._id"
                                class="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                                :class="{ 'bg-blue-50': currentChapter?._id === chapter._id }">
                                <router-link
                                    :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: chapter.chapterNumber || (index + 1) } }"
                                    class="block p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <p class="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                                Chương {{ chapter.chapterNumber || (index + 1) }}: {{ chapter.title }}
                                            </p>
                                            <div class="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                <span class="flex items-center gap-1">
                                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fill-rule="evenodd"
                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    {{ chapter.views || 0 }}
                                                </span>
                                                <span class="flex items-center gap-1">
                                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    {{ formatDate(chapter.createdAt) }}
                                                </span>
                                                <span v-if="chapter.audioUrl"
                                                    class="text-green-600 font-medium flex items-center gap-1">
                                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                    Có audio
                                                </span>
                                            </div>
                                        </div>

                                        <button v-if="chapter.audioUrl" @click.prevent.stop="playChapter(chapter)"
                                            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
                                            :class="isPlaying && currentChapter?._id === chapter._id
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'">
                                            <svg v-if="isPlaying && currentChapter?._id === chapter._id" class="w-5 h-5"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div v-else class="text-center text-gray-500 py-12">
                            Chưa có chương nào được cập nhật.
                        </div>
                    </div>

                    <!-- Ad -->
                    <div class="mt-6">
                        <AdDisplay position="story-detail" />
                    </div>
                </div>
            </div>

            <!-- Rating Section -->
            <div class="mt-12 animate-slide-up animation-delay-400">
                <RatingSection :storyId="story?._id" :averageRating="story?.averageRating || 0"
                    :totalRatings="story?.totalRatings || 0" @rating-updated="reloadStory" />
            </div>
        </div>

        <!-- Sticky Audio Player -->
        <transition name="slide-up">
            <div v-if="currentChapter && currentChapter.audioUrl"
                class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div class="flex flex-col md:flex-row items-center gap-4">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <div
                                class="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                                <img v-if="story.image" :src="getStoryImageUrl(story.image)" :alt="story.name"
                                    class="w-full h-full object-cover" />
                                <div v-else
                                    class="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-2xl">
                                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-gray-800 font-semibold truncate">{{ currentChapter.title }}</h4>
                                <p class="text-gray-600 text-sm">Chương {{ currentChapter.chapterNumber }}</p>
                            </div>
                        </div>

                        <audio ref="audioPlayer" :src="getAudioUrl(currentChapter.audioUrl)" controls
                            @play="isPlaying = true" @pause="isPlaying = false" @ended="onAudioEnded"
                            @timeupdate="updateProgress"
                            class="w-full md:w-auto md:flex-1 max-w-2xl h-12 rounded-lg"></audio>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import StoryService from '@/services/story.service';
import ChapterService from '@/services/chapter.service';
import FavoriteService from '@/services/favorite.service';
import HistoryService from '@/services/history.service';
import RatingSection from '@/components/RatingSection.vue';
import AdDisplay from '@/components/AdDisplay.vue';
import { useAuthStore } from '@/stores/auth.store';
import { getStoryImageUrl, getAudioUrl } from '@/utils/media';

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
const isDescriptionExpanded = ref(false);

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const getAuthors = () => {
    if (!story.value?.authorDetails || story.value.authorDetails.length === 0) {
        return 'Không xác định';
    }
    return story.value.authorDetails.map(author => author.fullName).join(', ');
};

const statusDisplay = computed(() => {
    if (!story.value) return { text: '', class: '' };
    switch (story.value.status) {
        case 'ONGOING':
            return { text: 'Đang tiến hành', class: 'bg-green-100 text-green-800' };
        case 'COMPLETED':
            return { text: 'Đã hoàn thành', class: 'bg-blue-100 text-blue-800' };
        case 'DROPPED':
            return { text: 'Đã tạm dừng', class: 'bg-red-100 text-red-800' };
        default:
            return { text: 'Không xác định', class: 'bg-gray-100 text-gray-800' };
    }
});

const truncatedDescription = computed(() => {
    const desc = story.value?.description || 'Truyện này chưa có mô tả.';
    if (story.value?.description && story.value.description.length > 250 && !isDescriptionExpanded.value) {
        return story.value.description.substring(0, 250) + '...';
    }
    return desc;
});

const toggleDescription = () => {
    isDescriptionExpanded.value = !isDescriptionExpanded.value;
};

const playChapter = async (chapter) => {
    if (!chapter.audioUrl) {
        alert('Chương này chưa có audio');
        return;
    }

    if (currentChapter.value?._id === chapter._id && isPlaying.value) {
        audioPlayer.value?.pause();
    } else {
        currentChapter.value = chapter;
        saveHistory(chapter._id);
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

const updateProgress = () => {
    if (audioPlayer.value) {
        const progress = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
        playProgress.value = progress || 0;
    }
};

const onAudioEnded = () => {
    const currentIndex = story.value.chapters.findIndex(c => c._id === currentChapter.value._id);
    if (currentIndex < story.value.chapters.length - 1) {
        const nextChapter = story.value.chapters[currentIndex + 1];
        if (nextChapter.audioUrl) {
            playChapter(nextChapter);
        }
    }
};

const toggleFavorite = async () => {
    if (!authStore.isLoggedIn) {
        alert('⚠️ Vui lòng đăng nhập để thêm vào yêu thích');
        router.push('/login');
        return;
    }

    try {
        const result = await FavoriteService.toggleFavorite(story.value._id);
        isFavorite.value = result.isFavorite;
    } catch (err) {
        console.error('Toggle favorite error:', err);
        alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
    }
};

const checkFavoriteStatus = async () => {
    if (authStore.isLoggedIn && story.value) {
        try {
            const result = await FavoriteService.checkFavorite(story.value._id);
            isFavorite.value = result.isFavorite;
        } catch (err) {
            console.error('Check favorite error:', err);
        }
    }
};

const saveHistory = async (chapterId = null) => {
    if (authStore.isLoggedIn && story.value) {
        try {
            await HistoryService.addHistory(story.value._id, chapterId);
        } catch (err) {
            console.error('Save history error:', err);
        }
    }
};

const reloadStory = async () => {
    try {
        const updatedStory = await StoryService.getBySlug(props.slug);
        story.value.averageRating = updatedStory.averageRating;
        story.value.totalRatings = updatedStory.totalRatings;
    } catch (err) {
        console.error('Reload story error:', err);
    }
};

onMounted(async () => {
    try {
        story.value = await StoryService.getBySlug(props.slug);
        await checkFavoriteStatus();
        await saveHistory();
    } catch (err) {
        error.value = 'Không tìm thấy truyện này hoặc đã có lỗi xảy ra.';
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
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
    animation: slide-up 0.7s ease-out forwards;
}

.animation-delay-100 {
    animation-delay: 100ms;
}

.animation-delay-200 {
    animation-delay: 200ms;
}

.animation-delay-400 {
    animation-delay: 400ms;
}

/* Slide up transition for audio player */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* Add some style for prose */
.prose p {
    margin-bottom: 1rem;
}
</style>