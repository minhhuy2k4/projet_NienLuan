<template>
    <div id="app-layout">
        <!-- Header (chỉ hiển thị khi không phải trang admin) -->
        <AppHeader v-if="!isAdminRoute" />

        <!-- Main Content -->
        <router-view />

        <!-- Footer (chỉ hiển thị khi không phải trang admin) -->
        <AppFooter v-if="!isAdminRoute" />

        <!-- Chatbot Widget -->
        <ChatbotWidget />
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/inc/AppHeader.vue';
import AppFooter from '@/components/inc/AppFooter.vue';
import ChatbotWidget from '@/components/ChatbotWidget.vue';
import { useThemeStore } from '@/stores/theme.store';

const route = useRoute();
const themeStore = useThemeStore();

const isAdminRoute = computed(() => {
    return route.path.startsWith('/admin');
});

// Initialize theme when app mounts (but not for admin)
onMounted(() => {
    if (!route.path.startsWith('/admin')) {
        themeStore.initTheme();
    }
});

// Re-apply theme when route changes (but skip admin pages)
watch(() => route.path, (newPath) => {
    if (!newPath.startsWith('/admin')) {
        themeStore.applyTheme();
    } else {
        // Remove dark class for admin pages
        document.documentElement.classList.remove('dark');
    }
}, { immediate: true });
</script>

<style>
/* Global styles remain the same */
</style>