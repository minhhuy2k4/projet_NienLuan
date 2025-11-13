<template>
    <main class="category-page">
        <!-- Banner -->
        <div class="category-banner animate-fade-in">
            <h1>THỂ LOẠI TRUYỆN</h1>
            <p>Khám phá kho truyện đa dạng theo từng thể loại</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <p class="error-message">{{ error }}</p>
        </div>

        <!-- Categories Grid -->
        <div v-else class="categories-container">
            <div class="categories-grid">
                <div v-for="(category, index) in categories" :key="category._id" class="category-card animate-slide-up"
                    :style="{ animationDelay: `${index * 50}ms` }" @click="goToCategory(category.slug)">
                    <div class="category-icon">
                        {{ getCategoryIcon(category.name) }}
                    </div>
                    <h3 class="category-name">{{ category.name }}</h3>
                    <p v-if="category.description" class="category-description">
                        {{ category.description }}
                    </p>
                    <div class="category-stats">
                        <span class="story-count">{{ category.storyCount || 0 }} truyện</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import categoryService from '@/services/category.service';

const router = useRouter();
const categories = ref([]);
const loading = ref(true);
const error = ref(null);

// Icon mapping cho các thể loại
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
    // Tìm icon theo tên category
    for (const [key, icon] of Object.entries(categoryIcons)) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return icon;
        }
    }
    return '📖'; // Icon mặc định
};

const fetchCategories = async () => {
    try {
        loading.value = true;
        categories.value = await categoryService.getAll();
    } catch (err) {
        console.error('Error fetching categories:', err);
        error.value = 'Không thể tải danh sách thể loại';
    } finally {
        loading.value = false;
    }
};

const goToCategory = (categorySlug) => {
    router.push({ name: 'category.detail', params: { slug: categorySlug } });
};

onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.category-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.category-banner {
    text-align: center;
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
    margin-bottom: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.category-banner h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.category-banner p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.loading-container,
.error-container {
    text-align: center;
    padding: 4rem 1rem;
}

.error-message {
    color: #f44336;
    font-size: 1.1rem;
}

.categories-container {
    margin-top: 2rem;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}

.category-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
}

.category-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--primary-blue);
}

.category-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
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

.category-card:hover .category-icon {
    animation: none;
    transform: scale(1.2);
}

.category-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.category-description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.5;
}

.category-stats {
    padding-top: 1rem;
    border-top: 2px solid #f0f0f0;
}

.story-count {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, var(--primary-blue) 0%, #667eea 100%);
    color: white;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
    .category-banner h1 {
        font-size: 2rem;
    }

    .category-banner p {
        font-size: 1rem;
    }

    .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .category-card {
        padding: 1.5rem;
    }

    .category-icon {
        font-size: 3rem;
    }
}

@media (max-width: 480px) {
    .categories-grid {
        grid-template-columns: 1fr;
    }
}
</style>
