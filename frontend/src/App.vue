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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/inc/AppHeader.vue';
import AppFooter from '@/components/inc/AppFooter.vue';
import ChatbotWidget from '@/components/ChatbotWidget.vue';

const route = useRoute();

const isAdminRoute = computed(() => {
    return route.path.startsWith('/admin');
});
</script>

<style>
/* Global styles remain the same */
</style>