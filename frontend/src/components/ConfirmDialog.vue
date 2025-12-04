<template>
    <Teleport to="body">
        <Transition name="dialog-fade">
            <div v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click.self="cancel">
                <Transition name="dialog-scale">
                    <div v-if="modelValue"
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
                        <!-- Header -->
                        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700" :class="headerClass">
                            <div class="flex items-center gap-3">
                                <!-- Icon -->
                                <div class="flex-shrink-0">
                                    <svg v-if="type === 'danger'" class="w-8 h-8 text-red-500" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else-if="type === 'warning'" class="w-8 h-8 text-yellow-500"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else-if="type === 'info'" class="w-8 h-8 text-blue-500" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <!-- Title -->
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                                    {{ title }}
                                </h3>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="px-6 py-5">
                            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {{ message }}
                            </p>
                        </div>

                        <!-- Footer -->
                        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
                            <button @click="cancel" type="button"
                                class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
                                {{ cancelText }}
                            </button>
                            <button @click="confirm" type="button"
                                class="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                :class="confirmButtonClass">
                                {{ confirmText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Xác nhận'
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'warning', // 'danger', 'warning', 'info', 'success'
        validator: (value) => ['danger', 'warning', 'info', 'success'].includes(value)
    },
    confirmText: {
        type: String,
        default: 'Xác nhận'
    },
    cancelText: {
        type: String,
        default: 'Hủy'
    }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const headerClass = computed(() => {
    const classes = {
        danger: 'bg-red-50 dark:bg-red-900/20',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20',
        info: 'bg-blue-50 dark:bg-blue-900/20',
        success: 'bg-green-50 dark:bg-green-900/20'
    };
    return classes[props.type] || classes.warning;
});

const confirmButtonClass = computed(() => {
    const classes = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    };
    return classes[props.type] || classes.warning;
});

const confirm = () => {
    emit('confirm');
    emit('update:modelValue', false);
};

const cancel = () => {
    emit('cancel');
    emit('update:modelValue', false);
};
</script>

<style scoped>
/* Dialog transitions */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
}

.dialog-scale-enter-active,
.dialog-scale-leave-active {
    transition: all 0.3s ease;
}

.dialog-scale-enter-from,
.dialog-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
