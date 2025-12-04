<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center gap-3 mb-2">
                    <!-- Fire Icon -->
                    <svg v-if="iconType === 'fire'" class="w-12 h-12 text-red-600" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd" />
                    </svg>
                    <!-- Check Icon -->
                    <svg v-else-if="iconType === 'check'" class="w-12 h-12 text-green-600" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <!-- Sparkles Icon for New -->
                    <svg v-else-if="iconType === 'new'" class="w-12 h-12 text-purple-600" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <!-- Default Book Icon -->
                    <svg v-else class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <h1 class="text-4xl font-bold text-gray-800">{{ title }}</h1>
                </div>
                <p class="text-gray-600">{{ description }}</p>
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

            <!-- Empty State -->
            <div v-else-if="stories.length === 0" class="text-center py-20 animate-slide-up">
                <svg class="w-32 h-32 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Chưa có truyện</h3>
                <p class="text-gray-600 mb-6">Hiện tại chưa có truyện nào trong danh mục này</p>
                <router-link to="/"
                    class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105">
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
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                        ← Trước
                    </button>

                    <div class="flex gap-2 flex-wrap">
                        <!-- First page -->
                        <button v-if="currentPage > 3" @click="goToPage(1)"
                            class="px-4 py-2 rounded-lg transition bg-white text-gray-700 hover:bg-blue-100 border border-blue-200">
                            1
                        </button>
                        <span v-if="currentPage > 4" class="px-4 py-2">...</span>

                        <!-- Pages around current -->
                        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                            'px-4 py-2 rounded-lg transition',
                            page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-blue-100 border border-blue-200'
                        ]">
                            {{ page }}
                        </button>

                        <!-- Last page -->
                        <span v-if="currentPage < totalPages - 3" class="px-4 py-2">...</span>
                        <button v-if="currentPage < totalPages - 2" @click="goToPage(totalPages)"
                            class="px-4 py-2 rounded-lg transition bg-white text-gray-700 hover:bg-blue-100 border border-blue-200">
                            {{ totalPages }}
                        </button>
                    </div>

                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                        Sau →
                    </button>
                </div>

                <!-- Page info -->
                <div v-if="totalPages > 1" class="text-center mt-4 text-gray-600">
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
        default: 'book',  // 'fire', 'check', 'new', 'book'
        validator: (value) => ['fire', 'check', 'new', 'book'].includes(value)
    },
    fetchFunction: {
        type: Function,
        required: true
    }
});

const route = useRoute();

const stories = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);

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
        const result = await props.fetchFunction(page, 24);
        stories.value = result.stories || [];
        total.value = result.total || 0;
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
