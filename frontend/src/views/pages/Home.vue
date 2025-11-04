<template>
    <main class="home-container">
        <!-- Banner Slider -->
        <BannerSlider />

        <!-- Quảng cáo trang chủ -->
        <div class="my-6">
            <AdDisplay position="home" />
        </div>

        <section class="story-section">
            <h2 class="section-title animate-fade-in">TRUYỆN MỚI CẬP NHẬT</h2>

            <div v-if="loading" class="loading">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            </div>
            <div v-else-if="error" class="error">{{ error }}</div>

            <div v-else class="story-grid">
                <div v-for="(story, index) in stories" :key="story._id" class="animate-slide-up"
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

const stories = ref([]);
const loading = ref(true);
const error = ref(null);

// Hàm được gọi khi component được tải
onMounted(async () => {
    try {
        loading.value = true;
        stories.value = await StoryService.getAll();
    } catch (err) {
        error.value = 'Không thể tải danh sách truyện.';
        console.error(err);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    color: var(--primary-text);
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
</style>