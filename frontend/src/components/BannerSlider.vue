<template>
    <div class="banner-slider">
        <div class="slider-container">
            <!-- Slides -->
            <div class="slides-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div v-for="(slide, index) in slides" :key="index" class="slide"
                    :style="{ backgroundImage: `url(${slide.image})` }">
                    <div class="slide-overlay"></div>
                    <div class="slide-content">
                        <h2 class="slide-title animate-fade-in">{{ slide.title }}</h2>
                        <p class="slide-subtitle animate-slide-up animation-delay-100">{{ slide.subtitle }}</p>
                    </div>
                </div>
            </div>

            <!-- Navigation Arrows -->
            <button @click="prevSlide" class="nav-btn nav-prev" aria-label="Previous">
                ‹
            </button>
            <button @click="nextSlide" class="nav-btn nav-next" aria-label="Next">
                ›
            </button>

            <!-- Dots Indicator -->
            <div class="dots-container">
                <button v-for="(slide, index) in slides" :key="`dot-${index}`" @click="goToSlide(index)"
                    :class="['dot', { active: currentSlide === index }]"
                    :aria-label="`Go to slide ${index + 1}`"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BannerService from '@/services/banner.service';

const currentSlide = ref(0);
const autoplayInterval = ref(null);
const slides = ref([]);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Default slides nếu API lỗi hoặc chưa có data
const defaultSlides = [
    {
        image: 'https://i.pinimg.com/originals/c0/4d/44/c04d44c4057662ef7ba805ff42e0f7ab.jpg',
        title: 'TRUYỆN HÀN QUỐC',
        subtitle: 'Khám phá thế giới Manhwa đầy màu sắc'
    },
    {
        image: 'https://i.pinimg.com/originals/42/2e/37/422e37d7e59d1c45d6b8e8dd5ef71d3d.jpg',
        title: 'TRUYỆN NHẬT BẢN',
        subtitle: 'Manga hot nhất hiện nay'
    },
    {
        image: 'https://i.pinimg.com/originals/2e/d7/28/2ed728c0c3f0b1d4f7e9d6c8e5a4b3f2.jpg',
        title: 'TRUYỆN TRUNG QUỐC',
        subtitle: 'Manhua kiếm hiệp hấp dẫn'
    }
];

// Get full image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

// Load banners from API
const loadBanners = async () => {
    try {
        const response = await BannerService.getActive();
        const banners = response.data || [];

        if (banners.length > 0) {
            slides.value = banners.map(b => ({
                image: getImageUrl(b.image),
                title: b.title,
                subtitle: b.subtitle
            }));
        } else {
            slides.value = defaultSlides;
        }
    } catch (error) {
        console.error('Load banners error:', error);
        slides.value = defaultSlides;
    }
};

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
    currentSlide.value = index;
};

const startAutoplay = () => {
    autoplayInterval.value = setInterval(() => {
        nextSlide();
    }, 5000); // Chuyển slide mỗi 5 giây
};

const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
    }
};

onMounted(() => {
    loadBanners();
    startAutoplay();
});

onUnmounted(() => {
    stopAutoplay();
});
</script>

<style scoped>
.banner-slider {
    width: 100%;
    margin-bottom: 3rem;
    animation: fadeIn 0.8s ease-in;
}

.slider-container {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.slides-wrapper {
    display: flex;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide {
    min-width: 100%;
    height: 100%;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.slide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.2) 100%);
}

.slide-content {
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
    color: white;
    z-index: 2;
    max-width: 600px;
}

.slide-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.slide-title::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
    margin-top: 1rem;
}

.slide-subtitle {
    font-size: 1.3rem;
    font-weight: 400;
    opacity: 0.9;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
}

/* Navigation Buttons */
.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    border: none;
    color: white;
    font-size: 3rem;
    width: 60px;
    height: 60px;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
}

.nav-prev {
    left: 20px;
}

.nav-next {
    right: 20px;
}

/* Dots Indicator */
.dots-container {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}

.dot:hover {
    transform: scale(1.2);
}

.dot.active {
    background: white;
    width: 30px;
    border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
    .slider-container {
        height: 300px;
        border-radius: 12px;
    }

    .slide-title {
        font-size: 2rem;
    }

    .slide-subtitle {
        font-size: 1rem;
    }

    .nav-btn {
        width: 40px;
        height: 40px;
        font-size: 2rem;
    }

    .nav-prev {
        left: 10px;
    }

    .nav-next {
        right: 10px;
    }
}

@media (max-width: 480px) {
    .slider-container {
        height: 250px;
    }

    .slide-title {
        font-size: 1.5rem;
    }

    .slide-subtitle {
        font-size: 0.9rem;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
