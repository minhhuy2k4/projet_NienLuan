<template>
    <div class="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b border-blue-100 pb-3">
            💬 Bình luận ({{ totalCount }})
        </h2>

        <!-- Comment Form -->
        <div v-if="authStore.isLoggedIn" class="mb-6">
            <div class="flex gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ authStore.user?.name?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div class="flex-1">
                    <textarea v-model="newComment" @keydown.ctrl.enter="submitComment" :disabled="submitting"
                        placeholder="Viết bình luận của bạn... (Ctrl+Enter để gửi)"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3" maxlength="1000"></textarea>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-sm text-gray-500">{{ newComment.length }}/1000</span>
                        <button @click="submitComment" :disabled="!newComment.trim() || submitting"
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ submitting ? 'Đang gửi...' : 'Gửi bình luận' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Login prompt -->
        <div v-else class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p class="text-gray-700 mb-3">Đăng nhập để bình luận</p>
            <router-link to="/login"
                class="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                Đăng nhập
            </router-link>
        </div>

        <!-- Comments List -->
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-500">
            <span class="text-4xl mb-2 block">💭</span>
            Chưa có bình luận nào. Hãy là người đầu tiên!
        </div>

        <div v-else class="space-y-4">
            <div v-for="comment in comments" :key="comment._id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <!-- Comment Header -->
                <div class="flex items-start gap-3 mb-3">
                    <div
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {{ comment.user?.name?.charAt(0).toUpperCase() || '?' }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-semibold text-gray-800">{{ comment.user?.name || 'Anonymous' }}</h4>
                                <p class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</p>
                            </div>
                            <div class="flex gap-2">
                                <!-- Edit button (own comment) -->
                                <button v-if="authStore.user?._id === comment.user?._id && !comment.isEditing"
                                    @click="startEdit(comment)"
                                    class="text-blue-600 hover:text-blue-700 text-sm transition">
                                    ✏️ Sửa
                                </button>
                                <!-- Delete button (own comment or admin) -->
                                <button v-if="authStore.user?._id === comment.user?._id || authStore.isAdmin"
                                    @click="deleteComment(comment._id)"
                                    class="text-red-600 hover:text-red-700 text-sm transition">
                                    🗑️ Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Comment Content -->
                <div v-if="!comment.isEditing" class="ml-13 mb-3">
                    <p class="text-gray-700 whitespace-pre-line">{{ comment.content }}</p>
                </div>

                <!-- Edit Form -->
                <div v-else class="ml-13 mb-3">
                    <textarea v-model="comment.editContent"
                        class="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3" maxlength="1000"></textarea>
                    <div class="flex gap-2 mt-2">
                        <button @click="saveEdit(comment)"
                            class="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                            Lưu
                        </button>
                        <button @click="cancelEdit(comment)"
                            class="px-4 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded transition">
                            Hủy
                        </button>
                    </div>
                </div>

                <!-- Comment Actions -->
                <div class="ml-13 flex items-center gap-4 text-sm">
                    <button @click="toggleLike(comment)" :disabled="!authStore.isLoggedIn"
                        class="flex items-center gap-1 transition"
                        :class="comment.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'">
                        <span>{{ comment.isLiked ? '❤️' : '🤍' }}</span>
                        <span>{{ comment.likeCount || 0 }}</span>
                    </button>
                    <button @click="toggleReply(comment)" v-if="authStore.isLoggedIn"
                        class="text-gray-600 hover:text-blue-600 transition">
                        💬 Trả lời
                    </button>
                    <button @click="reportComment(comment._id)"
                        v-if="authStore.isLoggedIn && authStore.user?._id !== comment.user?._id"
                        class="text-gray-600 hover:text-orange-600 transition">
                        🚩 Báo cáo
                    </button>
                </div>

                <!-- Reply Form -->
                <div v-if="comment.showReplyForm" class="ml-13 mt-3 flex gap-2">
                    <input v-model="comment.replyContent" @keydown.enter="submitReply(comment)"
                        placeholder="Viết câu trả lời..." maxlength="1000"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <button @click="submitReply(comment)"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        Gửi
                    </button>
                    <button @click="cancelReply(comment)"
                        class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition">
                        Hủy
                    </button>
                </div>

                <!-- Replies -->
                <div v-if="comment.replies && comment.replies.length > 0" class="ml-13 mt-4 space-y-3">
                    <div v-for="reply in comment.replies" :key="reply._id" class="border-l-2 border-blue-300 pl-4 py-2">
                        <div class="flex items-start gap-2 mb-2">
                            <div
                                class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {{ reply.user?.name?.charAt(0).toUpperCase() || '?' }}
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h5 class="font-semibold text-sm text-gray-800">{{ reply.user?.name ||
                                            'Anonymous' }}</h5>
                                        <p class="text-xs text-gray-500">{{ formatDate(reply.createdAt) }}</p>
                                    </div>
                                    <button v-if="authStore.user?._id === reply.user?._id || authStore.isAdmin"
                                        @click="deleteComment(reply._id)"
                                        class="text-red-600 hover:text-red-700 text-sm transition">
                                        🗑️
                                    </button>
                                </div>
                                <p class="text-gray-700 text-sm mt-1 whitespace-pre-line">{{ reply.content }}</p>
                                <div class="flex items-center gap-3 mt-2 text-xs">
                                    <button @click="toggleLike(reply)" :disabled="!authStore.isLoggedIn"
                                        class="flex items-center gap-1 transition"
                                        :class="reply.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'">
                                        <span>{{ reply.isLiked ? '❤️' : '🤍' }}</span>
                                        <span>{{ reply.likeCount || 0 }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-4">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                ← Trước
            </button>
            <span class="text-gray-700 font-medium">
                Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                Sau →
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import CommentService from '@/services/comment.service';

const props = defineProps({
    chapterId: { type: String, required: true }
});

const authStore = useAuthStore();

const comments = ref([]);
const newComment = ref('');
const loading = ref(false);
const submitting = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage));

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Load comments
const loadComments = async () => {
    try {
        loading.value = true;
        const skip = (currentPage.value - 1) * itemsPerPage;
        const response = await CommentService.getByChapter(props.chapterId, itemsPerPage, skip);
        const result = response.data; // API trả về { data: { comments, pagination } }
        comments.value = result.comments.map(c => ({ ...c, showReplyForm: false, replyContent: '', isEditing: false, editContent: '' }));
        totalCount.value = result.pagination.total;
    } catch (error) {
        console.error('Load comments error:', error);
    } finally {
        loading.value = false;
    }
};

// Submit comment
const submitComment = async () => {
    if (!newComment.value.trim()) return;
    
    // Kiểm tra login
    if (!authStore.isLoggedIn || !authStore.user || !authStore.token) {
        alert('⚠️ Vui lòng đăng nhập để bình luận!');
        return;
    }

    try {
        submitting.value = true;
        await CommentService.create(props.chapterId, newComment.value.trim());
        newComment.value = '';
        currentPage.value = 1;
        await loadComments();
    } catch (error) {
        console.error('Submit comment error:', error);
        if (error.response?.status === 401) {
            alert('⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        } else {
            alert('❌ Có lỗi xảy ra khi gửi bình luận!');
        }
    } finally {
        submitting.value = false;
    }
};

// Toggle like
const toggleLike = async (comment) => {
    if (!authStore.isLoggedIn) {
        alert('⚠️ Vui lòng đăng nhập để thích bình luận');
        return;
    }

    try {
        const response = await CommentService.toggleLike(comment._id);
        const result = response.data; // { liked: true/false, action: "liked"/"unliked" }

        // Update local state
        if (result.liked) {
            // Liked
            comment.isLiked = true;
            comment.likeCount = (comment.likeCount || 0) + 1;
        } else {
            // Unliked
            comment.isLiked = false;
            comment.likeCount = Math.max((comment.likeCount || 0) - 1, 0);
        }
    } catch (error) {
        console.error('Toggle like error:', error);
    }
};

// Toggle reply form
const toggleReply = (comment) => {
    comment.showReplyForm = !comment.showReplyForm;
    comment.replyContent = '';
};

const cancelReply = (comment) => {
    comment.showReplyForm = false;
    comment.replyContent = '';
};

// Submit reply
const submitReply = async (comment) => {
    if (!comment.replyContent.trim()) return;

    try {
        await CommentService.create(props.chapterId, comment.replyContent.trim(), comment._id);
        comment.showReplyForm = false;
        comment.replyContent = '';
        await loadComments();
    } catch (error) {
        console.error('Submit reply error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Edit comment
const startEdit = (comment) => {
    comment.isEditing = true;
    comment.editContent = comment.content;
};

const cancelEdit = (comment) => {
    comment.isEditing = false;
    comment.editContent = '';
};

const saveEdit = async (comment) => {
    if (!comment.editContent.trim()) return;

    try {
        const updated = await CommentService.update(comment._id, comment.editContent.trim());
        comment.content = updated.content;
        comment.isEditing = false;
        comment.editContent = '';
    } catch (error) {
        console.error('Update comment error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Delete comment
const deleteComment = async (commentId) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
        await CommentService.delete(commentId);
        await loadComments();
    } catch (error) {
        console.error('Delete comment error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Report comment
const reportComment = async (commentId) => {
    const reason = prompt('Lý do báo cáo:');
    if (!reason) return;

    try {
        await CommentService.report(commentId, reason);
        alert('✅ Đã gửi báo cáo. Cảm ơn bạn!');
    } catch (error) {
        console.error('Report comment error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Pagination
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        loadComments();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        loadComments();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

watch(() => props.chapterId, () => {
    currentPage.value = 1;
    loadComments();
});

onMounted(() => {
    loadComments();
});
</script>

<style scoped>
.ml-13 {
    margin-left: 3.25rem;
}
</style>
