<template>
    <button @click="toggleTheme" class="theme-toggle" :class="{ 'theme-toggle-dark': isDark }"
        :title="isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'">
        <div class="toggle-track">
            <div class="toggle-thumb">
                <!-- Sun icon -->
                <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="toggle-icon" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
                <!-- Moon icon -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="toggle-icon" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </button>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme.store';

const themeStore = useThemeStore();

const isDark = computed(() => themeStore.theme === 'dark');

const toggleTheme = () => {
    themeStore.toggleTheme();
};
</script>

<style scoped>
.theme-toggle {
    position: relative;
    width: 64px;
    height: 32px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
}

.toggle-track {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0d9488, #14b8a6);
    border-radius: 9999px;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-toggle-dark .toggle-track {
    background: linear-gradient(135deg, #334155, #475569);
}

.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-toggle-dark .toggle-thumb {
    transform: translateX(32px);
    background: #1e293b;
}

.toggle-icon {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease;
}

.theme-toggle:not(.theme-toggle-dark) .toggle-icon {
    color: #f59e0b;
    /* amber-500 for sun */
}

.theme-toggle-dark .toggle-icon {
    color: #fbbf24;
    /* amber-400 for moon */
}

.theme-toggle:hover .toggle-track {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(13, 148, 136, 0.1);
}

.theme-toggle-dark:hover .toggle-track {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(51, 65, 85, 0.3);
}

.theme-toggle:active .toggle-thumb {
    width: 32px;
}

.theme-toggle:not(.theme-toggle-dark):active .toggle-thumb {
    transform: translateX(-2px);
}

.theme-toggle-dark:active .toggle-thumb {
    transform: translateX(30px);
}

/* Animation for icon rotation */
.toggle-icon {
    animation: iconRotate 0.3s ease;
}

@keyframes iconRotate {
    0% {
        transform: rotate(-180deg);
        opacity: 0;
    }

    100% {
        transform: rotate(0deg);
        opacity: 1;
    }
}
</style>
