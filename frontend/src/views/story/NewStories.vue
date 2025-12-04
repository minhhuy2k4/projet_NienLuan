<template>
    <StoryListWithPagination title="Truyện Mới Cập Nhật" description="Những truyện được cập nhật mới nhất"
        icon-type="new" :fetch-function="fetchNewStories" />
</template>

<script setup>
import StoryListWithPagination from '@/components/StoryListWithPagination.vue';
import StoryService from '@/services/story.service';

const fetchNewStories = async (page, limit) => {
    return await StoryService.getNewStories(page, limit);
};
</script>
