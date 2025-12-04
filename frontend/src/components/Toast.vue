<template>
    <Teleport to="body">
        <Transition name="toast-slide">
            <div v-if="modelValue"
                class="fixed top-4 right-4 z-50 min-w-[320px] max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-in">
                <div class="flex items-start gap-3 p-4">
                    <!-- Icon -->
                    <div class="flex-shrink-0 mt-0.5">
                        <svg v-if="type === 'success'" class="w-6 h-6 text-green-500" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        <svg v-else-if="type === 'error'" class="w-6 h-6 text-red-500" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                        <svg v-else-if="type === 'warning'" class="w-6 h-6 text-yellow-500" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                        <svg v-else class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 pt-0.5">
                        <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ message }}</p>
                        <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ description }}
                        </p>
                    </div>

                    <!-- Close Button -->
                    <button @click="close" type="button"
                        class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <!-- Progress Bar -->
                <div v-if="duration > 0" class="h-1 bg-gray-200 dark:bg-gray-700">
                    <div class="h-full bg-current transition-all ease-linear" :class="progressBarClass"
                        :style="{ width: progress + '%' }"></div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'info', // 'success', 'error', 'warning', 'info'
        validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
        type: Number,
        default: 3000 // Auto close after 3 seconds
    }
});

const emit = defineEmits(['update:modelValue']);

const progress = ref(100);
let timer = null;
let progressInterval = null;

const progressBarClass = computed(() => {
    const classes = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
    };
    return classes[props.type] || classes.info;
});

const close = () => {
    emit('update:modelValue', false);
    clearTimer();
};

const clearTimer = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
};

const startTimer = () => {
    if (props.duration <= 0) return;

    clearTimer();
    progress.value = 100;

    const startTime = Date.now();
    const endTime = startTime + props.duration;

    progressInterval = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        progress.value = Math.max(0, (remaining / props.duration) * 100);

        if (remaining <= 0) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }, 50);

    timer = setTimeout(() => {
        close();
    }, props.duration);
};

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        startTimer();
    } else {
        clearTimer();
    }
}, { immediate: true });

onUnmounted(() => {
    clearTimer();
});
</script>

<style scoped>
.toast-slide-enter-active {
    animation: slideInRight 0.3s ease-out;
}

.toast-slide-leave-active {
    animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.animate-slide-in {
    animation: slideInRight 0.3s ease-out;
}
</style>
