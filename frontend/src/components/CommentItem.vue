<template>
    <div class="comment-item">
        <div class="flex items-start gap-2 mb-2">
            <img :src="avatarUrl" :alt="comment.user?.name"
                class="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2" :class="avatarBorderClass"
                @error="$event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'User')}&background=random&color=fff`" />
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div>
                        <h5 class="font-semibold text-sm text-gray-800">{{ comment.user?.name || 'Anonymous' }}</h5>
                        <p class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</p>
                    </div>
                    <div class="flex gap-2">
                        <button v-if="authStore.user?._id === comment.user?._id" @click="$emit('edit', comment)"
                            class="text-blue-600 hover:text-blue-700 text-sm transition">
                            ✏️
                        </button>
                        <button v-if="authStore.user?._id === comment.user?._id || authStore.isAdmin"
                            @click="$emit('delete', comment._id)"
                            class="text-red-600 hover:text-red-700 text-sm transition">
                            🗑️
                        </button>
                    </div>
                </div>

                <!-- Content Display -->
                <div v-if="!comment.isEditing">
                    <p class="text-gray-700 text-sm mt-1 whitespace-pre-line" v-html="formatContent(comment.content)">
                    </p>
                </div>

                <!-- Edit Form -->
                <div v-else class="mt-2">
                    <textarea v-model="comment.editContent"
                        class="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        rows="2" maxlength="1000"></textarea>
                    <div class="flex gap-2 mt-2">
                        <button @click="$emit('save-edit', comment)"
                            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                            Lưu
                        </button>
                        <button @click="$emit('cancel-edit', comment)"
                            class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded transition">
                            Hủy
                        </button>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3 mt-2 text-xs">
                    <button @click="$emit('toggle-like', comment)" :disabled="!authStore.isLoggedIn"
                        class="flex items-center gap-1 transition"
                        :class="comment.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'">
                        <span>{{ comment.isLiked ? '❤️' : '🤍' }}</span>
                        <span>{{ comment.likeCount || 0 }}</span>
                    </button>
                    <button @click="$emit('toggle-reply', comment)" v-if="authStore.isLoggedIn"
                        class="text-gray-600 hover:text-blue-600 transition">
                        💬 Trả lời
                    </button>
                    <button @click="$emit('report', comment._id)"
                        v-if="authStore.isLoggedIn && authStore.user?._id !== comment.user?._id"
                        class="text-gray-600 hover:text-orange-600 transition">
                        🚩 Báo cáo
                    </button>
                </div>

                <!-- Reply Form -->
                <div v-if="comment.showReplyForm" class="mt-3 flex gap-2">
                    <textarea v-model="comment.replyContent" placeholder="Viết câu trả lời..."
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        rows="2" maxlength="500"></textarea>
                    <button @click="$emit('submit-reply', comment)" :disabled="!comment.replyContent?.trim()"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 text-sm">
                        Gửi
                    </button>
                    <button @click="$emit('cancel-reply', comment)"
                        class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition text-sm">
                        Hủy
                    </button>
                </div>
            </div>
        </div>

        <!-- Nested Replies (Recursive) -->
        <div v-if="comment.replies && comment.replies.length > 0">
            <!-- Nút xem/ẩn replies -->
            <button @click="toggleShowReplies"
                class="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-2 ml-2 transition flex items-center gap-1">
                <span v-if="showReplies">▲ Ẩn {{ comment.replies.length }} trả lời</span>
                <span v-else>▼ Xem {{ comment.replies.length }} trả lời</span>
            </button>

            <!-- Danh sách replies (chỉ hiện khi showReplies = true) -->
            <div v-if="showReplies" :class="nestedClass">
                <CommentItem v-for="(reply, index) in visibleReplies" :key="reply._id" :comment="reply"
                    :depth="depth + 1" @toggle-like="$emit('toggle-like', $event)"
                    @toggle-reply="$emit('toggle-reply', $event)" @submit-reply="$emit('submit-reply', $event)"
                    @cancel-reply="$emit('cancel-reply', $event)" @edit="$emit('edit', $event)"
                    @save-edit="$emit('save-edit', $event)" @cancel-edit="$emit('cancel-edit', $event)"
                    @delete="$emit('delete', $event)" @report="$emit('report', $event)" />

                <!-- Nút xem thêm (nếu có nhiều hơn REPLY_LIMIT) -->
                <button v-if="showReplies && comment.replies.length > REPLY_LIMIT && !showAllReplies"
                    @click="showAllReplies = true"
                    class="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-2 ml-2 transition">
                    ▼ Xem thêm {{ comment.replies.length - REPLY_LIMIT }} trả lời
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/utils/media';

// Component tự gọi chính nó (recursive)
import CommentItem from './CommentItem.vue';

const props = defineProps({
    comment: { type: Object, required: true },
    depth: { type: Number, default: 0 }
});

const authStore = useAuthStore();

// Số lượng replies hiển thị mặc định khi mở
const REPLY_LIMIT = 3;
const showReplies = ref(false); // Mặc định ẩn tất cả replies
const showAllReplies = ref(false);

// Toggle hiển thị/ẩn replies
const toggleShowReplies = () => {
    showReplies.value = !showReplies.value;
    if (!showReplies.value) {
        showAllReplies.value = false; // Reset khi ẩn
    }
};

// Danh sách replies hiển thị (giới hạn hoặc tất cả)
const visibleReplies = computed(() => {
    const total = props.comment.replies?.length || 0;

    if (showAllReplies.value || total <= REPLY_LIMIT) {
        return props.comment.replies;
    }
    return props.comment.replies.slice(0, REPLY_LIMIT);
});

// Màu avatar theo cấp độ
const avatarClass = computed(() => {
    const colors = [
        'bg-gradient-to-br from-purple-500 to-purple-700',
        'bg-gradient-to-br from-green-500 to-green-700',
        'bg-gradient-to-br from-blue-500 to-blue-700',
        'bg-gradient-to-br from-orange-500 to-orange-700',
        'bg-gradient-to-br from-pink-500 to-pink-700',
    ];
    return colors[props.depth % colors.length];
});

// Border color cho avatar theo cấp độ
const avatarBorderClass = computed(() => {
    const colors = [
        'border-purple-400',
        'border-green-400',
        'border-blue-400',
        'border-orange-400',
        'border-pink-400',
    ];
    return colors[props.depth % colors.length];
});

// Avatar URL với fallback
const avatarUrl = computed(() => {
    const avatar = props.comment.user?.avatar;
    const name = props.comment.user?.name || 'User';

    // Nếu có avatar, dùng getAvatarUrl
    if (avatar) {
        const url = getAvatarUrl(avatar);
        if (url) return url;
    }

    // Fallback: UI Avatars API
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
});

// Margin left cho nested replies
const nestedClass = computed(() => {
    const margins = ['ml-6', 'ml-8', 'ml-10', 'ml-12'];
    const marginIndex = Math.min(props.depth, margins.length - 1);
    return `${margins[marginIndex]} mt-3 space-y-3 border-l-2 border-blue-300 pl-4 py-2`;
});

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

// Format content with @mention highlight
const formatContent = (content) => {
    if (!content) return '';
    return content.replace(/@([^\s@]+(?:\s+[^\s@]+)*)/g, '<span class="text-blue-600 font-semibold">@$1</span>');
};
</script>

<style scoped>
.comment-item {
    margin-bottom: 0.75rem;
}
</style>
