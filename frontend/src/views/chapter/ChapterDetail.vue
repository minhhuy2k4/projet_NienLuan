<template>
    <div class="page-gradient" style="min-height: 100vh;">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="loading-spinner"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-xl p-8 rounded-lg border"
                style="color: var(--color-danger); background-color: var(--bg-secondary); border-color: var(--border-color);">
                {{ error }}</div>
        </div>

        <!-- Chapter Content -->
        <div v-else-if="chapter && story" class="max-w-5xl mx-auto px-4 py-8">
            <!-- Breadcrumb -->
            <nav class="text-sm mb-6 animate-fade-in">
                <router-link to="/" style="color: var(--text-secondary);" class="transition"
                    @mouseover="$event.target.style.color = 'var(--color-primary)'"
                    @mouseleave="$event.target.style.color = 'var(--text-secondary)'">Trang chủ</router-link>
                <span class="mx-2" style="color: var(--text-tertiary);">/</span>
                <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                    style="color: var(--text-secondary);" class="transition"
                    @mouseover="$event.target.style.color = 'var(--color-primary)'"
                    @mouseleave="$event.target.style.color = 'var(--text-secondary)'">
                    {{ story.name }}
                </router-link>
                <span class="mx-2" style="color: var(--text-secondary);">/</span>
                <span class="font-semibold" style="color: var(--text-primary);">Chương {{ chapter.chapterNumber
                    }}</span>
            </nav>

            <!-- Quảng cáo chi tiết chương -->
            <div class="mb-6">
                <AdDisplay position="chapter-detail" />
            </div>

            <!-- Chapter Header -->
            <div class="rounded-xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up"
                style="background-color: var(--bg-card); border: 1px solid var(--border-color);">
                <div class="flex items-start gap-4 mb-6">
                    <!-- Story Cover -->
                    <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                        class="flex-shrink-0 group">
                        <img v-if="story.image" :src="getStoryImageUrl(story.image)" :alt="story.name"
                            class="w-24 h-32 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform border-2 border-blue-100" />
                        <div v-else
                            class="w-24 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-4xl shadow-md">
                            <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        </div>
                    </router-link>

                    <!-- Chapter Info -->
                    <div class="flex-1 min-w-0">
                        <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                            class="transition text-sm mb-2 inline-block" style="color: var(--text-secondary);"
                            @mouseover="$event.target.style.color = 'var(--color-primary)'"
                            @mouseleave="$event.target.style.color = 'var(--text-secondary)'">
                            ← Quay lại {{ story.name }}
                        </router-link>
                        <h1 class="text-3xl md:text-4xl font-bold mb-2" style="color: var(--text-primary);">
                            Chương {{ chapter.chapterNumber }}: {{ chapter.title }}
                        </h1>
                        <div class="flex flex-wrap items-center gap-4 text-sm" style="color: var(--text-secondary);">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>{{ formatViews(chapter.views || 0) }} lượt xem</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>{{ formatDate(chapter.createdAt) }}</span>
                            </div>
                            <div v-if="chapter.updatedAt && chapter.updatedAt !== chapter.createdAt"
                                class="flex items-center gap-2">
                                <svg class="w-4 h-4" style="color: var(--text-secondary);" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Cập nhật: {{ formatDate(chapter.updatedAt) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Audio Player (if available) -->
                <div v-if="chapter.audioUrl" class="rounded-xl p-6 border-2"
                    style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-hover)); border-color: var(--color-primary);">
                    <div class="flex items-center gap-3 mb-4">
                        <svg class="w-6 h-6" style="color: var(--color-primary);" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                        <h3 class="text-lg font-semibold" style="color: var(--text-primary);">Audio truyện</h3>
                    </div>
                    <audio ref="audioPlayer" :src="getAudioUrl(chapter.audioUrl)" controls @play="isPlaying = true"
                        @pause="isPlaying = false" @ended="onAudioEnded" @timeupdate="updateProgress"
                        class="w-full h-12 rounded-lg"></audio>

                    <!-- Progress Info -->
                    <div v-if="audioPlayer" class="mt-3 text-sm flex justify-between"
                        style="color: var(--text-secondary);">
                        <span>{{ formatTime(currentTime) }}</span>
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                </div>

                <!-- No Audio Message -->
                <div v-else class="rounded-xl p-6 text-center border"
                    style="background-color: var(--bg-secondary); border-color: var(--color-warning);">
                    <svg class="w-12 h-12 mx-auto mb-2 block" style="color: var(--color-warning);" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616 0zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                    <p class="font-medium" style="color: var(--text-primary);">Chương này chưa có audio</p>
                </div>
            </div>

            <!-- Chapter Content -->
            <div class="rounded-xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up animation-delay-100"
                style="background-color: var(--bg-card); border: 1px solid var(--border-color);">
                <h2 class="text-2xl font-bold mb-4 pb-3"
                    style="color: var(--text-primary); border-bottom: 1px solid var(--border-color);">
                    <svg class="w-6 h-6 inline-block mr-2" style="color: var(--color-primary);" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Nội dung chương
                </h2>
                <div class="prose max-w-none" style="color: var(--text-primary);">
                    <div v-if="chapter.content" class="leading-relaxed"
                        style="white-space: pre-wrap; word-wrap: break-word;">
                        {{ chapter.content }}
                    </div>
                    <p v-else class="italic" style="color: var(--text-secondary);">
                        Chương này chưa có nội dung.
                    </p>
                </div>
            </div>

            <!-- Chapter Navigation -->
            <div class="rounded-xl shadow-lg p-6 animate-slide-up animation-delay-200"
                style="background-color: var(--bg-card); border: 1px solid var(--border-color);">
                <h2 class="text-xl font-bold mb-4 pb-3"
                    style="color: var(--text-primary); border-bottom: 1px solid var(--border-color);">
                    <svg class="w-5 h-5 inline-block mr-2" style="color: var(--color-primary);" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Điều hướng chương
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Previous Chapter -->
                    <button v-if="previousChapter"
                        @click="goToChapter(previousChapter.chapterNumber || (allChapters.indexOf(previousChapter) + 1))"
                        class="flex items-center gap-3 p-4 rounded-lg transition-all transform hover:scale-105 group"
                        style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-hover)); border: 1px solid var(--border-color);">
                        <svg class="w-6 h-6 group-hover:scale-110 transition-transform"
                            style="color: var(--color-primary);" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        <div class="text-left flex-1 min-w-0">
                            <div class="text-xs mb-1" style="color: var(--text-secondary);">Chương trước</div>
                            <div class="font-semibold truncate" style="color: var(--text-primary);">
                                Ch.{{ previousChapter.chapterNumber || (allChapters.indexOf(previousChapter) + 1) }}: {{
                                    previousChapter.title }}
                            </div>
                        </div>
                    </button>
                    <div v-else class="p-4 rounded-lg text-center"
                        style="background-color: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-color);">
                        <svg class="w-6 h-6 mx-auto" style="color: var(--text-secondary);" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        <div class="text-sm mt-1">Không có chương trước</div>
                    </div>

                    <!-- Story List -->
                    <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }"
                        class="flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all transform hover:scale-105 group"
                        style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-hover)); border: 1px solid var(--border-color);">
                        <svg class="w-6 h-6 group-hover:scale-110 transition-transform"
                            style="color: var(--color-primary);" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <div class="font-semibold text-center" style="color: var(--text-primary);">Danh sách chương
                        </div>
                    </router-link>

                    <!-- Next Chapter -->
                    <button v-if="nextChapter"
                        @click="goToChapter(nextChapter.chapterNumber || (allChapters.indexOf(nextChapter) + 1))"
                        class="flex items-center gap-3 p-4 rounded-lg transition-all transform hover:scale-105 group"
                        style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-hover)); border: 1px solid var(--border-color);">
                        <div class="text-right flex-1 min-w-0">
                            <div class="text-xs mb-1" style="color: var(--text-secondary);">Chương tiếp theo</div>
                            <div class="font-semibold truncate" style="color: var(--text-primary);">
                                Ch.{{ nextChapter.chapterNumber || (allChapters.indexOf(nextChapter) + 1) }}: {{
                                    nextChapter.title }}
                            </div>
                        </div>
                        <svg class="w-6 h-6 group-hover:scale-110 transition-transform"
                            style="color: var(--color-primary);" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div v-else class="p-4 rounded-lg text-center"
                        style="background-color: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-color);">
                        <svg class="w-6 h-6 mx-auto" style="color: var(--text-secondary);" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        <div class="text-sm mt-1">Không có chương tiếp theo</div>
                    </div>
                </div>

                <!-- Auto-play toggle -->
                <div v-if="nextChapter && chapter.audioUrl" class="mt-6 pt-6 flex items-center justify-center gap-3"
                    style="border-top: 1px solid var(--border-color);">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="autoPlayNext"
                            class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                        <svg class="w-5 h-5" style="color: var(--color-primary);" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="font-medium" style="color: var(--text-secondary);">Tự động chuyển chương khi hết
                            audio</span>
                    </label>
                </div>
            </div>

            <!-- Related Chapters -->
            <div v-if="allChapters.length > 0"
                class="mt-6 rounded-xl shadow-lg p-6 animate-slide-up animation-delay-300"
                style="background-color: var(--bg-card); border: 1px solid var(--border-color);">
                <h2 class="text-xl font-bold mb-4 pb-3"
                    style="color: var(--text-primary); border-bottom: 1px solid var(--border-color);">
                    <svg class="w-5 h-5 inline-block mr-2" style="color: var(--color-primary);" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Các chương khác
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    <router-link v-for="(ch, index) in allChapters" :key="ch._id"
                        :to="{ name: 'chapter.detail', params: { storySlug: props.storySlug, chapterNumber: ch.chapterNumber || (index + 1) } }"
                        class="p-3 rounded-lg transition-all border-2" :style="ch._id === chapter._id
                            ? { backgroundColor: 'var(--bg-hover)', borderColor: 'var(--color-primary)', fontWeight: '600' }
                            : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }">
                        <div class="text-sm mb-1" style="color: var(--text-secondary);">Chương {{ ch.chapterNumber ||
                            (index + 1) }}</div>
                        <div class="text-xs truncate"
                            :style="{ color: ch._id === chapter._id ? 'var(--color-primary)' : 'var(--text-primary)' }">
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
import AdDisplay from '@/components/AdDisplay.vue';
import { useAuthStore } from '@/stores/auth.store';
import { getStoryImageUrl, getAudioUrl } from '@/utils/media';

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
    // Kiểm tra kỹ: phải có user và token
    if (authStore.isLoggedIn && authStore.user && authStore.token && story.value && chapter.value) {
        try {
            await HistoryService.addHistory(story.value._id, chapter.value._id);
        } catch (err) {
            // Bỏ qua lỗi 401 (không login) - không cần log
            if (err.response?.status !== 401) {
                console.error('Save history error:', err);
            }
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
