<template>
    <StoryListWithPagination title="Truyện Hot - Nghe Nhiều Nhất" description="Những truyện có nhiều lượt nghe nhất"
        icon-type="fire" :fetch-function="fetchHotStories" />
</template>

<script setup>
import StoryListWithPagination from '@/components/StoryListWithPagination.vue';
import StoryService from '@/services/story.service';

const fetchHotStories = async (page, limit) => {
    return await StoryService.getHotStories(page, limit);
};
</script>
