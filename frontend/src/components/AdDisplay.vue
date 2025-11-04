<template>
    <div v-if="ads.length > 0" class="ad-display" :class="`ad-position-${position}`">
        <div v-for="ad in ads" :key="ad._id" class="ad-item">
            <a :href="ad.link" target="_blank" rel="noopener noreferrer" @click="handleClick(ad._id)"
                class="ad-link block hover:opacity-90 transition-opacity">
                <div class="ad-container rounded-lg overflow-hidden shadow-md">
                    <img :src="getImageUrl(ad.image)" :alt="ad.title" class="ad-image w-full h-auto object-cover" />
                    <div v-if="ad.title || ad.description" class="ad-content p-3 bg-gray-50">
                        <h3 v-if="ad.title" class="font-semibold text-sm mb-1">{{ ad.title }}</h3>
                        <p v-if="ad.description" class="text-xs text-gray-600">{{ ad.description }}</p>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import AdService from '@/services/ad.service';

const props = defineProps({
    position: {
        type: String,
        required: true,
        validator: (value) => ['home', 'story-detail', 'chapter-detail'].includes(value)
    }
});

const ads = ref([]);

// Load ads by position
const loadAds = async () => {
    try {
        const response = await AdService.getByPosition(props.position);
        ads.value = response.data;

        // Track view for all loaded ads
        ads.value.forEach(ad => {
            AdService.trackView(ad._id);
        });
    } catch (error) {
        console.error('Error loading ads:', error);
    }
};

// Handle click
const handleClick = (adId) => {
    AdService.trackClick(adId);
};

// Get image URL với base URL từ config
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return `${API_BASE_URL}${image}`;
};

onMounted(() => {
    loadAds();
});
</script>

<style scoped>
.ad-display {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.ad-item {
    width: 100%;
    max-width: 100%;
}

.ad-link {
    display: block;
    text-decoration: none;
}

.ad-container {
    border: 1px solid #e5e7eb;
    background: #fff;
    transition: all 0.3s ease;
}

.ad-container:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
}

/* Trang chủ - Banner ngang lớn (970x90 hoặc 728x90) */
.ad-position-home .ad-item {
    max-width: 970px;
    margin: 0 auto;
}

.ad-position-home .ad-image {
    max-height: 200px;
    width: 100%;
    object-fit: cover;
}

/* Chi tiết truyện - Medium Rectangle (300x250) */
.ad-position-story-detail .ad-item {
    max-width: 600px;
    margin: 0 auto;
}

.ad-position-story-detail .ad-image {
    max-height: 400px;
    width: 100%;
    object-fit: cover;
}

/* Chi tiết chương - Medium Rectangle (300x250) */
.ad-position-chapter-detail .ad-item {
    max-width: 600px;
    margin: 0 auto;
}

.ad-position-chapter-detail .ad-image {
    max-height: 400px;
    width: 100%;
    object-fit: cover;
}

/* Mobile responsive */
@media (max-width: 768px) {

    .ad-position-home .ad-item,
    .ad-position-story-detail .ad-item,
    .ad-position-chapter-detail .ad-item {
        max-width: 100%;
    }

    .ad-position-home .ad-image {
        max-height: 100px;
    }

    .ad-position-story-detail .ad-image,
    .ad-position-chapter-detail .ad-image {
        max-height: 250px;
    }
}

/* Label quảng cáo (tùy chọn) */
.ad-display::before {
    content: 'Quảng cáo';
    font-size: 10px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: -0.5rem;
}
</style>
