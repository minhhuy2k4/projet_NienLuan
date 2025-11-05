<template>
    <div class="story-card">
        <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }" class="card-image-link">
            <img :src="getStoryImageUrl(story.image)" :alt="story.name" class="story-image">
            <div class="story-stats">
                <span class="chapters">📚 {{ story.chapterCount || 0 }}</span>
                <span class="views">👁️ {{ story.totalViews || 0 }}</span>
            </div>
        </router-link>
        <div class="card-content">
            <h3 class="story-title">
                <router-link :to="{ name: 'story.detail', params: { slug: story.slug } }">
                    {{ story.name }}
                </router-link>
            </h3>
        </div>
    </div>
</template>

<script setup>
import { getStoryImageUrl } from '@/utils/media';

defineProps({
    story: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.story-card {
    background: var(--white-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.story-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-image-link {
    position: relative;
    display: block;
    flex-shrink: 0;
}

.story-image {
    width: 100%;
    height: 240px;
    object-fit: cover;
    display: block;
}

.story-stats {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
}

.card-content {
    padding: 0.75rem 1rem 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.story-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
}

.story-title a:hover {
    color: var(--primary-blue);
}

.story-meta {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: auto;
}

.story-author {
    font-size: 0.85rem;
    color: var(--secondary-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.latest-chapter {
    font-size: 0.8rem;
    color: var(--primary-blue);
    font-weight: 500;
}
</style>
