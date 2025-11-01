<template>
    <main class="category-detail-page">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <p class="error-message">{{ error }}</p>
            <button @click="$router.back()" class="back-button">Quay lại</button>
        </div>

        <!-- Category Content -->
        <div v-else-if="category">
            <!-- Category Header -->
            <div class="category-header animate-fade-in">
                <button @click="$router.back()" class="back-btn">
                    ← Quay lại
                </button>
                <div class="header-content">
                    <div class="category-icon-large">
                        {{ getCategoryIcon(category.name) }}
                    </div>
                    <h1 class="category-title">{{ category.name }}</h1>
                    <p v-if="category.description" class="category-desc">
                        {{ category.description }}
                    </p>
                    <div class="category-meta">
                        <span class="meta-item">
                            📚 {{ stories.length }} truyện
                        </span>
                    </div>
                </div>
            </div>

            <!-- Stories Grid -->
            <div class="stories-section">
                <h2 class="section-title animate-slide-up">Truyện trong thể loại này</h2>

                <!-- Empty State -->
                <div v-if="stories.length === 0" class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Chưa có truyện nào trong thể loại này</p>
                </div>

                <!-- Stories List -->
                <div v-else class="stories-grid">
                    <div v-for="(story, index) in stories" :key="story._id" class="animate-slide-up"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <StoryCard :story="story" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import categoryService from '@/services/category.service';
import storyService from '@/services/story.service';
import StoryCard from '@/components/StoryCard.vue';

const route = useRoute();
const router = useRouter();

const category = ref(null);
const stories = ref([]);
const loading = ref(true);
const error = ref(null);

// Icon mapping (giống CategoryList)
const categoryIcons = {
    'Kinh dị': '👻',
    'Hài hước': '😂',
    'Lãng mạn': '💕',
    'Hành động': '⚔️',
    'Phiêu lưu': '🗺️',
    'Trinh thám': '🔍',
    'Khoa học viễn tưởng': '🚀',
    'Kỳ ảo': '🔮',
    'Học đường': '📚',
    'Võ thuật': '🥋',
    'Drama': '🎭',
    'Slice of Life': '☕',
    'Supernatural': '✨',
    'Tâm lý': '🧠',
    'Isekai': '🌍'
};

const getCategoryIcon = (name) => {
    for (const [key, icon] of Object.entries(categoryIcons)) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return icon;
        }
    }
    return '📖';
};

const fetchCategoryDetail = async () => {
    try {
        loading.value = true;
        const categorySlug = route.params.slug;

        // Lấy thông tin category bằng slug
        category.value = await categoryService.getBySlug(categorySlug);

        // Lấy tất cả stories và filter theo category
        const allStories = await storyService.getAll();

        // Filter stories có chứa categoryId trong mảng categoryDetails
        // Backend populate categoryDetails từ categories ObjectId array
        stories.value = allStories.filter(story => {
            if (!story.categoryDetails || !Array.isArray(story.categoryDetails)) {
                return false;
            }
            return story.categoryDetails.some(cat => cat._id === category.value._id);
        });

        console.log('Category:', category.value);
        console.log('Filtered Stories:', stories.value);
    } catch (err) {
        console.error('Error fetching category detail:', err);
        error.value = 'Không thể tải thông tin thể loại';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchCategoryDetail();
});
</script>

<style scoped>
.category-detail-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.loading-container,
.error-container {
    text-align: center;
    padding: 4rem 1rem;
}

.error-message {
    color: #f44336;
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

.back-button {
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
}

.back-button:hover {
    background-color: var(--primary-blue-hover);
    transform: translateY(-2px);
}

.category-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 3rem 2rem;
    color: white;
    margin-bottom: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    position: relative;
}

.back-btn {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
}

.header-content {
    text-align: center;
}

.category-icon-large {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
}

.category-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-transform: uppercase;
}

.category-desc {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 1.5rem;
}

.category-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1.5rem;
}

.meta-item {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    font-weight: 600;
    font-size: 1.1rem;
}

.stories-section {
    margin-top: 2rem;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 2rem;
    text-align: center;
}

.empty-state {
    text-align: center;
    padding: 4rem 1rem;
}

.empty-icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state p {
    font-size: 1.2rem;
    color: var(--text-secondary);
}

.stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
    .category-title {
        font-size: 2rem;
    }

    .category-icon-large {
        font-size: 3.5rem;
    }

    .category-header {
        padding: 2rem 1rem;
    }

    .meta-item {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}
</style>
