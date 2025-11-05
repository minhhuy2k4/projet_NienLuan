<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Search Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-5xl">🔍</span>
                    <div>
                        <h1 class="text-4xl font-bold text-gray-800">Tìm Kiếm Truyện</h1>
                        <p class="text-gray-600">Khám phá hàng ngàn câu chuyện hấp dẫn</p>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div class="flex gap-4">
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                            placeholder="Nhập tên truyện..."
                            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" />
                        <button @click="handleSearch" :disabled="loading"
                            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <span v-if="loading">⏳</span>
                            <span v-else>🔍</span>
                            {{ loading ? 'Đang tìm...' : 'Tìm kiếm' }}
                        </button>
                    </div>

                    <!-- Advanced Filters -->
                    <div class="mt-4 flex gap-4">
                        <select v-model="selectedCategory" @change="handleSearch"
                            class="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                            <option value="">Tất cả thể loại</option>
                            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                                {{ cat.name }}
                            </option>
                        </select>

                        <select v-model="selectedAuthor" @change="handleSearch"
                            class="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                            <option value="">Tất cả tác giả</option>
                            <option v-for="author in authors" :key="author._id" :value="author._id">
                                {{ author.fullName }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Search Info -->
                <div v-if="searchResults !== null && searchResults.total > 0" class="text-gray-600 text-lg">
                    Tìm thấy <strong class="text-blue-600">{{ searchResults.total }}</strong> kết quả
                    <span v-if="searchResults.query.q">
                        cho "<strong class="text-gray-800">{{ searchResults.query.q }}</strong>"
                    </span>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="text-red-600 bg-red-50 p-6 rounded-lg inline-block border border-red-200">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State (no search yet) -->
            <div v-else-if="searchResults === null" class="text-center py-20 animate-slide-up">
                <div class="text-8xl mb-4">🔍</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Bắt đầu tìm kiếm</h3>
                <p class="text-gray-600 mb-6">Nhập tên truyện hoặc chọn thể loại, tác giả để tìm kiếm</p>
            </div>

            <!-- Results List -->
            <div v-else-if="searchResults.results.length > 0" class="story-grid">
                <div v-for="(story, index) in searchResults.results" :key="story._id" class="animate-slide-up"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <StoryCard :story="story" />
                </div>
            </div>

            <!-- Empty Results -->
            <div v-else class="text-center py-20">
                <div class="text-8xl mb-4">😞</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy kết quả</h3>
                <p class="text-gray-600 mb-6">Hãy thử tìm kiếm với từ khóa khác</p>
                <button @click="clearSearch"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
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
