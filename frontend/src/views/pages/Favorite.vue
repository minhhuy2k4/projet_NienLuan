<template>
    <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-12">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header -->
            <div class="animate-fade-in mb-8">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-5xl">❤️</span>
                    <h1 class="text-4xl font-bold text-gray-800">Truyện Yêu Thích</h1>
                </div>
                <p class="text-gray-600">Những truyện mà bạn đã đánh dấu yêu thích</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="text-red-600 bg-red-50 p-6 rounded-lg inline-block border border-red-200">
                    {{ error }}
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="favorites.length === 0" class="text-center py-20 animate-slide-up">
                <div class="text-8xl mb-4">💔</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Chưa có truyện yêu thích</h3>
                <p class="text-gray-600 mb-6">Hãy khám phá và thêm những truyện bạn yêu thích vào danh sách!</p>
                <router-link to="/"
                    class="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition transform hover:scale-105">
                    Khám phá truyện
                </router-link>
            </div>

            <!-- Favorites Grid -->
            <div v-else>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
                    <div v-for="(story, index) in favorites" :key="story._id" class="relative animate-slide-up"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <StoryCard :story="story" />
                        <!-- Remove Button Overlay -->
                        <button @click="removeFavorite(story._id)"
                            class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 z-10"
                            title="Bỏ yêu thích">
                            <span class="text-sm">💔</span>
                        </button>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                        ← Trước
                    </button>
                    
                    <div class="flex gap-2">
                        <button v-for="page in Math.min(totalPages, 5)" :key="page"
                            @click="goToPage(page)"
                            :class="[
                                'px-4 py-2 rounded-lg transition',
                                page === currentPage
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-pink-100 border border-pink-200'
                            ]">
                            {{ page }}
                        </button>
                        <span v-if="totalPages > 5" class="px-4 py-2">...</span>
                        <button v-if="totalPages > 5 && currentPage < totalPages"
                            @click="goToPage(totalPages)"
                            :class="[
                                'px-4 py-2 rounded-lg transition',
                                totalPages === currentPage
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-pink-100 border border-pink-200'
                            ]">
                            {{ totalPages }}
                        </button>
                    </div>

                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                        Sau →
                    </button>
                </div>
            </div>

            <!-- Stats Summary -->
            <div v-if="total > 0"
                class="mt-12 bg-white rounded-xl p-6 shadow-lg animate-slide-up border border-pink-100">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div class="text-4xl font-bold text-pink-600">{{ total }}</div>
                        <div class="text-gray-600 mt-1">Truyện yêu thích</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-blue-600">{{ totalChapters }}</div>
                        <div class="text-gray-600 mt-1">Tổng số chương</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-purple-600">{{ uniqueCategories }}</div>
                        <div class="text-gray-600 mt-1">Thể loại khác nhau</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FavoriteService from '@/services/favorite.service';
import { useAuthStore } from '@/stores/auth.store';
import StoryCard from '@/components/StoryCard.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const favorites = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 12;

// Computed stats
const totalChapters = computed(() => {
    return favorites.value.reduce((sum, story) => sum + (story.chapterCount || 0), 0);
});

const uniqueCategories = computed(() => {
    const allCategories = new Set();
    favorites.value.forEach(story => {
        story.categoryDetails?.forEach(cat => allCategories.add(cat._id));
    });
    return allCategories.size;
});

// Fetch favorites
const fetchFavorites = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
        const result = await FavoriteService.getFavorites(page, limit);
        favorites.value = result.favorites || [];
        total.value = result.total || 0;
        currentPage.value = result.page || 1;
        totalPages.value = result.totalPages || 1;
        console.log('Favorites loaded:', result);
    } catch (err) {
        console.error('Fetch favorites error:', err);
        error.value = 'Không thể tải danh sách yêu thích';
    } finally {
        loading.value = false;
    }
};

// Remove favorite
const removeFavorite = async (storyId) => {
    if (!confirm('Bạn có chắc muốn bỏ yêu thích truyện này?')) return;

    try {
        await FavoriteService.removeFavorite(storyId);
        // Reload current page
        await fetchFavorites(currentPage.value);
        alert('💔 Đã bỏ yêu thích!');
    } catch (err) {
        console.error('Remove favorite error:', err);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Pagination
const goToPage = (page) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return;
    currentPage.value = page;
    fetchFavorites(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch route query for page changes
watch(() => route.query.page, (newPage) => {
    const page = parseInt(newPage) || 1;
    if (page !== currentPage.value) {
        fetchFavorites(page);
    }
}, { immediate: false });

// Initial load
onMounted(async () => {
    // Kiểm tra đăng nhập
    if (!authStore.isLoggedIn) {
        alert('⚠️ Vui lòng đăng nhập để xem truyện yêu thích');
        router.push('/login');
        return;
    }

    const page = parseInt(route.query.page) || 1;
    await fetchFavorites(page);
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
