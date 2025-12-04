<template>
    <main class="home-container">
        <!-- Banner Slider -->
        <BannerSlider />

        <!-- Quảng cáo trang chủ -->
        <div class="my-6">
            <AdDisplay position="home" />
        </div>

        <!-- TRUYỆN MỚI CẬP NHẬT -->
        <section class="story-section">
            <div class="section-header">
                <h2 class="section-title animate-fade-in">
                    <svg class="w-8 h-8 inline-block text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 3h7l7 7-7 7H3V3zM6 6a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                    TRUYỆN MỚI CẬP NHẬT
                </h2>
                <router-link to="/new-stories" class="view-all-link">
                    Xem tất cả →
                </router-link>
            </div>

            <div v-if="loadingNew" class="loading">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            </div>
            <div v-else-if="errorNew" class="error">{{ errorNew }}</div>
            <div v-else class="story-grid">
                <div v-for="(story, index) in newStories" :key="story._id" class="animate-slide-up"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <StoryCard :story="story" />
                </div>
            </div>
        </section>

        <!-- TRUYỆN HOT -->
        <section class="story-section">
            <div class="section-header">
                <h2 class="section-title animate-fade-in">
                    <svg class="w-8 h-8 inline-block text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd" />
                    </svg>
                    TRUYỆN HOT - NGHE NHIỀU NHẤT
                </h2>
                <router-link to="/hot-stories" class="view-all-link">
                    Xem tất cả →
                </router-link>
            </div>

            <div v-if="loadingHot" class="loading">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto"></div>
            </div>
            <div v-else-if="errorHot" class="error">{{ errorHot }}</div>
            <div v-else class="story-grid">
                <div v-for="(story, index) in hotStories" :key="story._id" class="animate-slide-up"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <StoryCard :story="story" />
                </div>
            </div>
        </section>

        <!-- TRUYỆN ĐÃ HOÀN THÀNH -->
        <section class="story-section">
            <div class="section-header">
                <h2 class="section-title animate-fade-in">
                    <svg class="w-8 h-8 inline-block text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    TRUYỆN ĐÃ HOÀN THÀNH
                </h2>
                <router-link to="/full-stories" class="view-all-link">
                    Xem tất cả →
                </router-link>
            </div>

            <div v-if="loadingFull" class="loading">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto"></div>
            </div>
            <div v-else-if="errorFull" class="error">{{ errorFull }}</div>
            <div v-else class="story-grid">
                <div v-for="(story, index) in fullStories" :key="story._id" class="animate-slide-up"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <StoryCard :story="story" />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BannerSlider from '@/components/BannerSlider.vue';
import StoryCard from '@/components/StoryCard.vue';
import AdDisplay from '@/components/AdDisplay.vue';
import StoryService from '@/services/story.service';

// Truyện mới cập nhật
const newStories = ref([]);
const loadingNew = ref(true);
const errorNew = ref(null);

// Truyện hot
const hotStories = ref([]);
const loadingHot = ref(true);
const errorHot = ref(null);

// Truyện đã hoàn thành
const fullStories = ref([]);
const loadingFull = ref(true);
const errorFull = ref(null);

// Hàm được gọi khi component được tải
onMounted(async () => {
    // Load truyện mới cập nhật (5 truyện)
    try {
        loadingNew.value = true;
        const result = await StoryService.getNewStories(1, 5);
        newStories.value = result.stories || [];
    } catch (err) {
        errorNew.value = 'Không thể tải truyện mới.';
        console.error('Load new stories error:', err);
    } finally {
        loadingNew.value = false;
    }

    // Load truyện hot (5 truyện)
    try {
        loadingHot.value = true;
        const result = await StoryService.getHotStories(1, 5);
        hotStories.value = result.stories || [];
    } catch (err) {
        errorHot.value = 'Không thể tải truyện hot.';
        console.error('Load hot stories error:', err);
    } finally {
        loadingHot.value = false;
    }

    // Load truyện đã hoàn thành (5 truyện)
    try {
        loadingFull.value = true;
        const result = await StoryService.getFullStories(1, 5);
        fullStories.value = result.stories || [];
    } catch (err) {
        errorFull.value = 'Không thể tải truyện hoàn thành.';
        console.error('Load full stories error:', err);
    } finally {
        loadingFull.value = false;
    }
});
</script>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.story-section {
    margin-bottom: 3rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e5e7eb;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--primary-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-title .icon {
    font-size: 1.75rem;
}

.view-all-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

.view-all-link:hover {
    background-color: #eff6ff;
    color: #2563eb;
    transform: translateX(4px);
}

.story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
}

.loading,
.error {
    text-align: center;
    font-size: 1.2rem;
    color: var(--secondary-text);
    padding: 2rem;
}

.error {
    color: #ef4444;
}

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

/* Responsive */
@media (max-width: 768px) {
    .home-container {
        padding: 1rem 0.5rem;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .section-title {
        font-size: 1.25rem;
    }

    .story-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .story-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}
</style>