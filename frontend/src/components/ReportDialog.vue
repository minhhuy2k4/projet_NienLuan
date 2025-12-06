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
                        <div
                            class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                            <div class="flex items-center gap-3">
                                <!-- Icon -->
                                <div class="flex-shrink-0">
                                    <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <!-- Title -->
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                                    Báo cáo bình luận
                                </h3>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="px-6 py-5">
                            <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                Vui lòng nhập lý do báo cáo bình luận này:
                            </p>
                            <textarea v-model="reason" placeholder="Nhập lý do báo cáo..."
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                                rows="4" maxlength="500"></textarea>
                            <p class="text-sm text-gray-500 mt-1">{{ reason.length }}/500</p>
                        </div>

                        <!-- Footer -->
                        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
                            <button @click="cancel" type="button"
                                class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
                                Hủy
                            </button>
                            <button @click="confirm" :disabled="!reason.trim()" type="button"
                                class="px-5 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                Gửi báo cáo
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const reason = ref('');

const confirm = () => {
    if (!reason.value.trim()) return;
    emit('confirm', reason.value.trim());
    emit('update:modelValue', false);
    reason.value = '';
};

const cancel = () => {
    emit('cancel');
    emit('update:modelValue', false);
    reason.value = '';
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