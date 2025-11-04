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
            <CommentItem v-for="comment in comments" :key="comment._id" :comment="comment" :depth="0"
                @toggle-like="toggleLike" @toggle-reply="toggleReply" @submit-reply="handleSubmitReply"
                @cancel-reply="cancelReply" @edit="startEdit" @save-edit="saveEdit" @cancel-edit="cancelEdit"
                @delete="deleteComment" @report="reportComment" />
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
import CommentItem from './CommentItem.vue';

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

// Load comments
const loadComments = async () => {
    try {
        loading.value = true;
        const skip = (currentPage.value - 1) * itemsPerPage;
        const response = await CommentService.getByChapter(props.chapterId, itemsPerPage, skip);
        const result = response.data; // API trả về { data: { comments, pagination } }

        // Map recursive để thêm showReplyForm, replyContent, etc
        const mapComment = (c) => ({
            ...c,
            showReplyForm: false,
            replyContent: '',
            isEditing: false,
            editContent: '',
            replies: c.replies ? c.replies.map(mapComment) : []
        });

        comments.value = result.comments.map(mapComment);
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
    // Nếu là reply (có parentId), thêm @mention
    // Nếu là comment chính (không có parentId), để trống
    if (comment.parentId && comment.user?.name) {
        comment.replyContent = `@${comment.user.name} `;
    } else {
        comment.replyContent = '';
    }
};

const cancelReply = (comment) => {
    comment.showReplyForm = false;
    comment.replyContent = '';
};

// Handle submit reply from CommentItem component
const handleSubmitReply = async (comment) => {
    if (!comment.replyContent?.trim()) return;

    try {
        // QUAN TRỌNG: Reply luôn trỏ đến comment đang reply (không phải comment gốc)
        // Nếu reply một comment chính => parentId = comment._id
        // Nếu reply một reply => parentId = reply._id (không phải reply.parentId!)
        const parentId = comment._id;

        await CommentService.create(
            props.chapterId,
            comment.replyContent.trim(),
            parentId
        );
        comment.showReplyForm = false;
        comment.replyContent = '';
        await loadComments();
    } catch (error) {
        console.error('Submit reply error:', error);
        alert('❌ Có lỗi xảy ra khi gửi câu trả lời!');
    }
};

// Submit reply (old function - keep for backward compatibility)
const submitReply = async (parentId, commentOrReply) => {
    if (!commentOrReply.replyContent?.trim()) return;

    try {
        // parentId là comment chính (cấp 1)
        // commentOrReply có thể là comment hoặc reply
        // Tất cả reply đều thuộc về comment chính (parentId)
        await CommentService.create(
            props.chapterId,
            commentOrReply.replyContent.trim(),
            parentId
        );
        commentOrReply.showReplyForm = false;
        commentOrReply.replyContent = '';
        await loadComments();
    } catch (error) {
        console.error('Submit reply error:', error);
        alert('❌ Có lỗi xảy ra khi gửi câu trả lời!');
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
