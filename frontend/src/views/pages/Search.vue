<template>
    <div class="page-gradient" style="min-height: 100vh; padding: 3rem 0;">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Search Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center gap-3 mb-4">
                    <svg class="w-16 h-16 page-header-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd" />
                    </svg>
                    <div>
                        <h1 class="page-title">Tìm Kiếm Truyện</h1>
                        <p class="page-subtitle">Khám phá hàng ngàn câu chuyện hấp dẫn</p>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="rounded-xl shadow-lg p-6 mb-6"
                    style="background-color: var(--bg-card); border: 1px solid var(--border-color);">
                    <div class="flex gap-4">
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                            placeholder="Nhập tên truyện..."
                            class="flex-1 px-4 py-3 rounded-lg focus:outline-none transition"
                            style="border: 2px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary);"
                            @focus="$event.target.style.borderColor = 'var(--color-primary)'"
                            @blur="$event.target.style.borderColor = 'var(--border-color)'" />
                        <button @click="handleSearch" :disabled="loading"
                            class="px-8 py-3 font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            style="background-color: var(--color-primary); color: white;"
                            @mouseover="$event.target.style.backgroundColor = 'var(--color-primary-light)'"
                            @mouseleave="$event.target.style.backgroundColor = 'var(--color-primary)'">
                            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                            {{ loading ? 'Đang tìm...' : 'Tìm kiếm' }}
                        </button>
                    </div>

                    <!-- Advanced Filters -->
                    <div class="mt-4 flex gap-4">
                        <select v-model="selectedCategory" @change="handleSearch"
                            class="px-4 py-2 rounded-lg focus:outline-none"
                            style="border: 2px solid var(--border-color); background-color: var(--bg-secondary); color: var(--text-primary);">
                            <option value="">Tất cả thể loại</option>
                            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                                {{ cat.name }}
                            </option>
                        </select>

                        <select v-model="selectedAuthor" @change="handleSearch"
                            class="px-4 py-2 rounded-lg focus:outline-none"
                            style="border: 2px solid var(--border-color); background-color: var(--bg-secondary); color: var(--text-primary);">
                            <option value="">Tất cả tác giả</option>
                            <option v-for="author in authors" :key="author._id" :value="author._id">
                                {{ author.fullName }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Search Info -->
                <div v-if="searchResults !== null && searchResults.total > 0" class="text-lg"
                    style="color: var(--text-secondary);">
                    Tìm thấy <strong style="color: var(--color-primary);">{{ searchResults.total }}</strong> kết quả
                    <span v-if="searchResults.query.q">
                        cho "<strong style="color: var(--text-primary);">{{ searchResults.query.q }}</strong>"
                    </span>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="loading-spinner"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="p-6 rounded-lg inline-block border"
                    style="color: var(--color-danger); background-color: var(--bg-secondary); border-color: var(--border-color);">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State (no search yet) -->
            <div v-else-if="searchResults === null" class="empty-state animate-slide-up">
                <svg class="empty-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd" />
                </svg>
                <h3 class="empty-title">Bắt đầu tìm kiếm</h3>
                <p class="empty-description">Nhập tên truyện hoặc chọn thể loại, tác giả để tìm kiếm</p>
            </div>

            <!-- Results List -->
            <div v-else-if="searchResults.results.length > 0" class="story-grid">
                <div v-for="(story, index) in searchResults.results" :key="story._id" class="animate-slide-up"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <StoryCard :story="story" />
                </div>
            </div>
            <!-- Empty Results -->
            <div v-else class="empty-state">
                <div class="text-8xl mb-4">😞</div>
                <h3 class="empty-title">Không tìm thấy kết quả</h3>
                <p class="empty-description mb-6">Hãy thử tìm kiếm với từ khóa khác</p>
                <button @click="clearSearch" class="btn-action-primary">
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StoryService from '@/services/story.service';
import CategoryService from '@/services/category.service';
import AuthorService from '@/services/author.service';
import StoryCard from '@/components/StoryCard.vue';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedAuthor = ref('');
const searchResults = ref(null);
const loading = ref(false);
const error = ref(null);
const categories = ref([]);
const authors = ref([]);

// Load categories and authors for filters
const loadFilters = async () => {
    try {
        const [categoriesData, authorsData] = await Promise.all([
            CategoryService.getAll(),
            AuthorService.getAll()
        ]);
        categories.value = categoriesData;
        authors.value = authorsData;
    } catch (err) {
        console.error('Load filters error:', err);
    }
};

// Perform search
const handleSearch = async () => {
    try {
        loading.value = true;
        error.value = null;

        searchResults.value = await StoryService.search(
            searchQuery.value,
            selectedCategory.value,
            selectedAuthor.value
        );

        // Update URL with search params
        router.push({
            path: '/search',
            query: {
                q: searchQuery.value || undefined,
                category: selectedCategory.value || undefined,
                author: selectedAuthor.value || undefined
            }
        });
    } catch (err) {
        console.error('Search error:', err);
        error.value = 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!';
    } finally {
        loading.value = false;
    }
};

// Clear search
const clearSearch = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
    selectedAuthor.value = '';
    searchResults.value = null;
    router.push('/search');
};

// Load search from URL params
const loadFromUrl = () => {
    if (route.query.q) {
        searchQuery.value = route.query.q;
    }
    if (route.query.category) {
        selectedCategory.value = route.query.category;
    }
    if (route.query.author) {
        selectedAuthor.value = route.query.author;
    }

    if (route.query.q || route.query.category || route.query.author) {
        handleSearch();
    }
};

// Watch route changes để đồng bộ khi URL thay đổi
watch(() => route.query, (newQuery) => {
    searchQuery.value = newQuery.q || '';
    selectedCategory.value = newQuery.category || '';
    selectedAuthor.value = newQuery.author || '';

    // Tự động search
    handleSearch();
}, { immediate: false });

onMounted(async () => {
    await loadFilters();
    loadFromUrl();

    // Nếu không có query params, load tất cả truyện
    if (!route.query.q && !route.query.category && !route.query.author) {
        handleSearch();
    }
});
</script>

<style scoped>
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

.story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
}
</style>
