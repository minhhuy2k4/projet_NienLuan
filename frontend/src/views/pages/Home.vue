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
                    <span class="icon">🆕</span>
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
                    <span class="icon">🔥</span>
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
                    <span class="icon">✅</span>
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