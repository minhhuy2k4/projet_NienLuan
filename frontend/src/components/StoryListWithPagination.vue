<template>
    <div class="story-list-page">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Back Button -->
            <button v-if="showBackButton" @click="$router.back()" class="back-button mb-4 animate-fade-in">
                ← Quay lại
            </button>

            <!-- Header -->
            <div class="page-header animate-fade-in mb-8">
                <div class="flex items-center gap-3 mb-2">
                    <!-- Fire Icon -->
                    <svg v-if="iconType === 'fire'" class="icon-large text-red-500" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd" />
                    </svg>
                    <!-- Check Icon -->
                    <svg v-else-if="iconType === 'check'" class="icon-large text-green-500" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <!-- Sparkles Icon for New -->
                    <svg v-else-if="iconType === 'new'" class="icon-large text-purple-500" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <!-- Default Book Icon -->
                    <svg v-else class="icon-large text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <h1 class="page-title">{{ title }}</h1>
                </div>
                <p class="page-description">{{ description }}</p>

                <!-- Filter Section -->
                <div v-if="enableFilter" class="mt-4 flex flex-wrap gap-3">
                    <select v-model="sortBy" @change="handleSortChange"
                        class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2"
                        style="background-color: var(--bg-card); color: var(--text-primary); border-color: var(--border-color);">
                        <option value="latest">Mới cập nhật</option>
                        <option value="views">Xem nhiều nhất</option>
                        <option value="rating">Đánh giá cao</option>
                        <option value="name">Tên A-Z</option>
                    </select>
                    <select v-model="statusFilter" @change="handleFilterChange"
                        class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2"
                        style="background-color: var(--bg-card); color: var(--text-primary); border-color: var(--border-color);">
                        <option value="">Tất cả trạng thái</option>
                        <option value="đang cập nhật">Đang cập nhật</option>
                        <option value="hoàn thành">Hoàn thành</option>
                    </select>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-container">
                <div class="error-box">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="stories.length === 0" class="empty-container animate-slide-up">
                <svg class="empty-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 class="empty-title">Chưa có truyện</h3>
                <p class="empty-description">Hiện tại chưa có truyện nào trong danh mục này</p>
                <router-link to="/" class="btn-primary-gradient">
                    Về trang chủ
                </router-link>
            </div>

            <!-- Stories Grid -->
            <div v-else>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
                    <div v-for="(story, index) in stories" :key="story._id" class="animate-slide-up"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <StoryCard :story="story" />
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination-wrapper">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
                        ← Trước
                    </button>

                    <div class="pagination-numbers">
                        <!-- First page -->
                        <button v-if="currentPage > 3" @click="goToPage(1)" class="pagination-number">
                            1
                        </button>
                        <span v-if="currentPage > 4" class="pagination-dots">...</span>

                        <!-- Pages around current -->
                        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                            :class="['pagination-number', { 'active': page === currentPage }]">
                            {{ page }}
                        </button>

                        <!-- Last page -->
                        <span v-if="currentPage < totalPages - 3" class="pagination-dots">...</span>
                        <button v-if="currentPage < totalPages - 2" @click="goToPage(totalPages)"
                            class="pagination-number">
                            {{ totalPages }}
                        </button>
                    </div>

                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="pagination-button">
                        Sau →
                    </button>
                </div>

                <!-- Page info -->
                <div v-if="totalPages > 1" class="page-info">
                    Trang {{ currentPage }} / {{ totalPages }} • Tổng {{ total }} truyện
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import StoryCard from '@/components/StoryCard.vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    iconType: {
        type: String,
        default: 'book',  // 'fire', 'check', 'new', 'book', 'category'
        validator: (value) => ['fire', 'check', 'new', 'book', 'category'].includes(value)
    },
    fetchFunction: {
        type: Function,
        required: true
    },
    showBackButton: {
        type: Boolean,
        default: false
    },
    enableFilter: {
        type: Boolean,
        default: false
    }
});

const route = useRoute();

const stories = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const sortBy = ref('latest');
const statusFilter = ref('');

const handleSortChange = () => {
    fetchStories(1);
};

const handleFilterChange = () => {
    fetchStories(1);
};

// Computed visible pages for pagination
const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// Fetch stories
const fetchStories = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
        const result = await props.fetchFunction(page, 24, sortBy.value, statusFilter.value);
        stories.value = result.stories || [];

        // Apply client-side filtering and sorting if enabled
        if (props.enableFilter) {
            let filtered = [...stories.value];

            // Filter by status
            if (statusFilter.value) {
                filtered = filtered.filter(story =>
                    story.status?.toLowerCase() === statusFilter.value.toLowerCase()
                );
            }

            // Sort
            switch (sortBy.value) {
                case 'views':
                    filtered.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
                    break;
                case 'rating':
                    filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                    break;
                case 'name':
                    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                    break;
                case 'latest':
                default:
                    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    break;
            }

            stories.value = filtered;
        }

        total.value = result.total || stories.value.length;
        currentPage.value = result.page || 1;
        totalPages.value = result.totalPages || 1;
    } catch (err) {
        console.error('Fetch stories error:', err);
        error.value = 'Không thể tải danh sách truyện';
    } finally {
        loading.value = false;
    }
};

// Pagination
const goToPage = (page) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return;
    currentPage.value = page;
    fetchStories(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch route query for page changes
watch(() => route.query.page, (newPage) => {
    const page = parseInt(newPage) || 1;
    if (page !== currentPage.value) {
        fetchStories(page);
    }
}, { immediate: false });

// Initial load
onMounted(async () => {
    const page = parseInt(route.query.page) || 1;
    await fetchStories(page);
});
</script>

<style scoped>
.story-list-page {
    min-height: 100vh;
    background-color: var(--bg-secondary);
    padding: 3rem 0;
    color: var(--text-primary);
}

.page-header {
    color: var(--text-primary);
}

.icon-large {
    width: 3rem;
    height: 3rem;
}

.page-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: 800;
    color: var(--text-primary);
}

.page-description {
    color: var(--text-secondary);
    font-size: 1.125rem;
}

.back-button {
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: 1rem;
    cursor: pointer;
    padding: 0.5rem 0;
    transition: color var(--transition-base);
}

.back-button:hover {
    color: var(--color-primary-light);
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
}

.loading-spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid var(--border-color);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.error-container {
    text-align: center;
    padding: 3rem 0;
}

.error-box {
    display: inline-block;
    padding: 1.5rem 2rem;
    background-color: var(--bg-tertiary);
    color: var(--color-danger);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    border-left: 4px solid var(--color-danger);
}

.empty-container {
    text-align: center;
    padding: 5rem 1rem;
}

.empty-icon {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 1.5rem;
    color: var(--text-tertiary);
    opacity: 0.5;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.empty-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.pagination-button {
    padding: 0.5rem 1rem;
    background-color: var(--color-primary);
    color: white;
    border-radius: var(--radius-lg);
    border: none;
    cursor: pointer;
    transition: all var(--transition-base);
    font-weight: 600;
}

.pagination-button:hover:not(:disabled) {
    background-color: var(--color-primary-light);
    box-shadow: var(--shadow-md);
}

.pagination-button:disabled {
    background-color: var(--bg-tertiary);
    color: var(--text-tertiary);
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination-numbers {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.pagination-number {
    padding: 0.5rem 1rem;
    background-color: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    font-weight: 600;
}

.pagination-number:hover {
    background-color: var(--bg-hover);
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.pagination-number.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.pagination-dots {
    padding: 0.5rem 1rem;
    color: var(--text-tertiary);
}

.page-info {
    text-align: center;
    margin-top: 1rem;
    color: var(--text-secondary);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
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
</style>
