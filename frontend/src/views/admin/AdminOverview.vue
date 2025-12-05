<template>
    <main class="main-content animate-fade-in">
        <header class="content-header animate-slide-up">
            <h1>Tổng quan Dashboard</h1>
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
                <h3>Top Truyện theo lượt xem</h3>
                <div v-if="loadingChart" class="chart-placeholder">
                    <p>Đang tải...</p>
                </div>
                <ul v-else-if="topStories.length > 0" class="top-stories-list">
                    <li v-for="(story, index) in topStories" :key="story._id" class="top-story-item">
                        <div class="story-rank">{{ index + 1 }}</div>
                        <div class="story-info">
                            <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }" class="story-name"
                                target="_blank">
                                {{ story.name }}
                            </router-link>
                            <div class="story-meta">
                                <span>📚 {{ story.chapterCount || 0 }} chương</span>
                            </div>
                        </div>
                        <div class="story-views">
                            <span class="views-count">{{ story.totalViews.toLocaleString() }}</span>
                            <span class="views-label">lượt xem</span>
                        </div>
                    </li>
                </ul>
                <div v-else class="chart-placeholder">
                    <p>Chưa có dữ liệu</p>
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
import { ref, computed, onMounted } from 'vue';
import storyService from '@/services/story.service';
import authorService from '@/services/author.service';
import categoryService from '@/services/category.service';
import statisticsService from '@/services/statistics.service';

const stats = ref({
    totalStories: 0,
    totalListens: 0,
    totalUsers: 0,
    totalCategories: 0
});

const recentStories = ref([]);
const topStories = ref([]);
const loadingChart = ref(true);

// Hàm format ngày tháng
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Format ngày cho chart (ngắn gọn)
const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
};

const loadStats = async () => {
    try {
        // Lấy thống kê tổng quan từ API
        const overviewStats = await statisticsService.getOverviewStats();

        stats.value = {
            totalStories: overviewStats.totalStories || 0,
            totalListens: overviewStats.totalListens || 0,
            totalUsers: overviewStats.totalAuthors || 0,
            totalCategories: overviewStats.totalCategories || 0
        };

        // Lấy stories để hiển thị danh sách mới
        const stories = await storyService.getAll();
        const sortedStories = stories
            .filter(story => story.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        recentStories.value = sortedStories.length > 0 ? sortedStories : stories.slice(0, 5);

    } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback: Load từ các API riêng lẻ nếu statistics API lỗi
        try {
            const [stories, authors, categories] = await Promise.all([
                storyService.getAll().catch(() => []),
                authorService.getAll().catch(() => []),
                categoryService.getAll().catch(() => [])
            ]);

            stats.value = {
                totalStories: stories.length || 0,
                totalListens: 0,
                totalUsers: authors.length || 0,
                totalCategories: categories.length || 0
            };

            const sortedStories = stories
                .filter(story => story.createdAt)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
            recentStories.value = sortedStories.length > 0 ? sortedStories : stories.slice(0, 5);
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
        }
    }
};

const loadTopStories = async () => {
    loadingChart.value = true;
    try {
        const stories = await statisticsService.getTopStories(10);
        console.log('Top stories received:', stories);
        topStories.value = stories || [];
    } catch (error) {
        console.error('Error loading top stories:', error);
        topStories.value = [];
    } finally {
        loadingChart.value = false;
    }
};

onMounted(() => {
    loadStats();
    loadTopStories();
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

.top-stories-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 500px;
    overflow-y: auto;
}

.top-story-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s;
}

.top-story-item:hover {
    background-color: #f8f9fa;
}

.top-story-item:last-child {
    border-bottom: none;
}

.story-rank {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    min-width: 40px;
    text-align: center;
}

.story-info {
    flex: 1;
    min-width: 0;
}

.story-name {
    font-weight: 600;
    color: var(--text-primary);
    text-decoration: none;
    display: block;
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.story-name:hover {
    color: #007bff;
    text-decoration: underline;
}

.story-meta {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.story-views {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 100px;
}

.views-count {
    font-size: 1.25rem;
    font-weight: bold;
    color: #28a745;
}

.views-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
}
</style>