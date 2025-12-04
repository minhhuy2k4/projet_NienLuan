<template>
    <main class="category-detail-page page-bg">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <p class="error-message" style="color: var(--color-danger);">{{ error }}</p>
            <button @click="$router.back()" class="btn-action-primary">Quay lại</button>
        </div>

        <!-- Category Content -->
        <div v-else-if="category">
            <!-- Category Header -->
            <div class="category-header animate-fade-in">
                <button @click="$router.back()" class="back-btn">
                    ← Quay lại
                </button>
                <div class="header-content">
                    <div class="category-icon-large" v-html="getCategoryIcon(category.name)"></div>
                    <h1 class="category-title">{{ category.name }}</h1>
                    <p v-if="category.description" class="category-desc">
                        {{ category.description }}
                    </p>
                    <div class="category-meta">
                        <span class="meta-item">
                            <svg class="w-5 h-5 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            {{ paginatedStories.length }} / {{ stories.length }} truyện
                        </span>
                    </div>
                </div>
            </div>

            <!-- Stories Grid -->
            <div class="stories-section">
                <h2 class="section-title animate-slide-up">Truyện trong thể loại này</h2>

                <!-- Empty State -->
                <div v-if="stories.length === 0" class="empty-state">
                    <svg class="empty-icon w-20 h-20 mx-auto mb-4 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p>Chưa có truyện nào trong thể loại này</p>
                </div>

                <!-- Stories List -->
                <div v-else class="stories-grid">
                    <div v-for="(story, index) in paginatedStories" :key="story._id" class="animate-slide-up"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <StoryCard :story="story" />
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination-container">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                        :class="['pagination-number', { active: currentPage === page }]">
                        {{ page }}
                    </button>

                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="pagination-button">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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
const currentPage = ref(1);
const limit = ref(24);

// Icon mapping với SVG
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        'Kinh dị': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>`,
        'Hài hước': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>`,
        'Lãng mạn': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`,
        'Hành động': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`,
        'Phiêu lưu': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>`,
        'Trinh thám': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`,
        'Bí ẩn': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`,
        'Khoa học viễn tưởng': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>`,
        'Kỳ ảo': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>`,
        'Học đường': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>`,
        'Võ thuật': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`,
        'Drama': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg>`,
        'Slice of Life': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`,
        'Supernatural': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>`,
        'Tâm lý': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>`,
        'Isekai': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    };

    // Search for matching category name
    for (const [key, svg] of Object.entries(iconMap)) {
        if (categoryName.toLowerCase().includes(key.toLowerCase())) {
            return svg;
        }
    }

    // Default book icon
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>`;
};

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(stories.value.length / limit.value));

const paginatedStories = computed(() => {
    const start = (currentPage.value - 1) * limit.value;
    const end = start + limit.value;
    return stories.value.slice(start, end);
});

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages.value, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    background-color: var(--bg-primary);
    min-height: 100vh;
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
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
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
    width: 5rem;
    height: 5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
}

.category-icon-large svg {
    width: 100%;
    height: 100%;
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

/* Pagination Styles */
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #f0f0f0;
}

.pagination-button {
    padding: 0.5rem;
    background-color: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
}

.pagination-button:not(:disabled):hover {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}

.pagination-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.pagination-number {
    padding: 0.5rem 1rem;
    min-width: 2.5rem;
    background-color: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    font-weight: 600;
}

.pagination-number:hover {
    background-color: var(--bg-hover);
    border-color: var(--color-primary);
}

.pagination-number.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}
</style>
