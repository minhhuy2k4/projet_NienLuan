<template>
    <StoryListWithPagination title="Truyện Đã Hoàn Thành"
        description="Những truyện đã hoàn thành, bạn có thể đọc trọn bộ" icon="✅" :fetch-function="fetchFullStories" />
</template>

<script setup>
import StoryListWithPagination from '@/components/StoryListWithPagination.vue';
import StoryService from '@/services/story.service';

const fetchFullStories = async (page, limit) => {
    return await StoryService.getFullStories(page, limit);
};
</script>
