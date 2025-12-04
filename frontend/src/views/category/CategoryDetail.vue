<template>
    <StoryListWithPagination :title="categoryTitle" :description="categoryDescription" icon-type="category"
        :fetch-function="fetchCategoryStories" :show-back-button="true" :enable-filter="true" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import StoryListWithPagination from '@/components/StoryListWithPagination.vue';
import categoryService from '@/services/category.service';
import storyService from '@/services/story.service';

const route = useRoute();

const category = ref(null);
const categoryTitle = computed(() => category.value ? category.value.name : 'Thể loại');
const categoryDescription = computed(() => category.value ? category.value.description || `Danh sách truyện thuộc thể loại ${category.value.name}` : 'Đang tải...');

// Load category info first
const loadCategoryInfo = async () => {
    try {
        const categorySlug = route.params.slug;
        const allCategories = await categoryService.getAll();
        category.value = allCategories.find(cat => cat.slug === categorySlug);
    } catch (err) {
        console.error('Error loading category:', err);
    }
};

// Fetch category stories
const fetchCategoryStories = async (page, limit) => {
    const categorySlug = route.params.slug;

    // Load category info if not loaded
    if (!category.value) {
        await loadCategoryInfo();
    }

    if (!category.value) {
        return { stories: [], total: 0, page: 1, totalPages: 1 };
    }

    // Get all stories and filter by category
    const allStories = await storyService.getAll();
    const filteredStories = allStories.filter(story => {
        if (!story.categoryDetails || !Array.isArray(story.categoryDetails)) {
            return false;
        }
        return story.categoryDetails.some(cat => cat._id === category.value._id);
    });

    // Manual pagination
    const total = filteredStories.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const stories = filteredStories.slice(start, end);

    return { stories, total, page, totalPages };
};

onMounted(() => {
    loadCategoryInfo();
});
</script>

<style scoped>
/* Styles được xử lý bởi StoryListWithPagination component */
</style>
