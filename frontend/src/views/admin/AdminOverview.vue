<template>
    <main class="main-content animate-fade-in">
        <header class="content-header animate-slide-up">
            <h2>Tổng quan Dashboard</h2>
            <span>Chào mừng Admin!</span>
        </header>
        <section class="stats-grid">
            <div class="stat-card blue animate-slide-up" style="animation-delay: 0.1s">
                <div class="stat-info">
                    <h3>{{ stats.totalStories }}</h3><span>Tổng số Truyện</span>
                </div>
                <div class="stat-icon">📚</div>
            </div>
            <div class="stat-card green animate-slide-up" style="animation-delay: 0.2s">
                <div class="stat-info">
                    <h3>{{ stats.totalListens }}</h3><span>Tổng lượt nghe</span>
                </div>
                <div class="stat-icon">🎧</div>
            </div>
            <div class="stat-card yellow animate-slide-up" style="animation-delay: 0.3s">
                <div class="stat-info">
                    <h3>{{ stats.totalUsers }}</h3><span>Tác giả</span>
                </div>
                <div class="stat-icon">👤</div>
            </div>
            <div class="stat-card red animate-slide-up" style="animation-delay: 0.4s">
                <div class="stat-info">
                    <h3>{{ stats.totalCategories }}</h3><span>Thể loại</span>
                </div>
                <div class="stat-icon">📂</div>
            </div>
        </section>
        <section class="main-data-grid animate-slide-up" style="margin-top: 2rem; animation-delay: 0.5s">
            <div class="data-card chart-card">
                <h3>Thống kê Lượt nghe</h3>
                <div class="chart-placeholder">
                    <p>Biểu đồ sẽ được thêm vào sau</p>
                </div>
            </div>
            <div class="data-card list-card">
                <h3>Truyện mới đăng</h3>
                <ul v-if="recentStories.length > 0" class="item-list">
                    <li v-for="story in recentStories" :key="story._id" class="story-item-overview">
                        <div>
                            <strong>{{ story.name }}</strong>
                            <small v-if="story.createdAt" class="story-date">
                                {{ formatDate(story.createdAt) }}
                            </small>
                        </div>
                    </li>
                </ul>
                <p v-else>Chưa có truyện nào</p>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import storyService from '@/services/story.service';
import authorService from '@/services/author.service';
import categoryService from '@/services/category.service';

const stats = ref({
    totalStories: 0,
    totalListens: 0,
    totalUsers: 0,
    totalCategories: 0
});

const recentStories = ref([]);

// Hàm format ngày tháng
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const loadStats = async () => {
    try {
        // Load basic stats
        const [stories, authors, categories] = await Promise.all([
            storyService.getAll().catch(() => []),
            authorService.getAll().catch(() => []),
            categoryService.getAll().catch(() => [])
        ]);

        stats.value = {
            totalStories: stories.length || 0,
            totalListens: 0, // Sẽ cập nhật khi có API
            totalUsers: authors.length || 0,
            totalCategories: categories.length || 0
        };

        // Get recent stories (sort by createdAt, take first 5)
        const sortedStories = stories
            .filter(story => story.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        recentStories.value = sortedStories.length > 0 ? sortedStories : stories.slice(0, 5);

    } catch (error) {
        console.error('Error loading stats:', error);
    }
};

onMounted(() => {
    loadStats();
});
</script>
<style scoped>
/* Style cho riêng trang này */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 5px solid;
}

.stat-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 2rem;
}

.stat-info span {
    color: var(--text-secondary);
    font-weight: 500;
}

.stat-icon {
    font-size: 3rem;
    opacity: 0.3;
}

.stat-card.blue {
    border-color: #007bff;
}

.stat-card.green {
    border-color: #28a745;
}

.stat-card.yellow {
    border-color: #ffc107;
}

.story-item-overview {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.story-date {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-style: italic;
}

.stat-card.red {
    border-color: #dc3545;
}

.chart-placeholder {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 8px;
    color: var(--text-secondary);
}
</style>