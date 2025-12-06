<template>
    <div class="rounded-xl shadow-lg p-6 border"
        style="background-color: var(--bg-card); border-color: var(--border-color);">
        <h2 class="text-2xl font-bold mb-6 border-b pb-3 flex items-center gap-2"
            style="color: var(--text-primary); border-color: var(--border-color);">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
            </svg>
            Bình luận ({{ totalCount }})
        </h2>

        <!-- Comment Form -->
        <div v-if="authStore.isLoggedIn" class="mb-6">
            <div class="flex gap-3">
                <img :src="userAvatarUrl" :alt="authStore.user?.name"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-blue-400"
                    @error="$event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'User')}&background=random&color=fff`" />
                <div class="flex-1">
                    <textarea v-model="newComment" @keydown.ctrl.enter="submitComment" :disabled="submitting"
                        placeholder="Viết bình luận của bạn... (Ctrl+Enter để gửi)" class="form-textarea-themed"
                        rows="3" maxlength="1000"></textarea>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-sm" style="color: var(--text-secondary);">{{ newComment.length }}/1000</span>
                        <button @click="submitComment" :disabled="!newComment.trim() || submitting"
                            class="btn-action-primary"
                            :style="{ opacity: (!newComment.trim() || submitting) ? '0.5' : '1', cursor: (!newComment.trim() || submitting) ? 'not-allowed' : 'pointer' }">
                            {{ submitting ? 'Đang gửi...' : 'Gửi bình luận' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Login prompt -->
        <div v-else class="mb-6 p-4 rounded-lg text-center border"
            style="background-color: var(--bg-secondary); border-color: var(--border-color);">
            <p class="mb-3" style="color: var(--text-primary);">Đăng nhập để bình luận</p>
            <router-link to="/login" class="btn-action-primary">
                Đăng nhập
            </router-link>
        </div>

        <!-- Comments List -->
        <div v-if="loading" class="text-center py-8">
            <div class="loading-spinner mx-auto"></div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
            </svg>
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
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Trước
            </button>
            <span class="font-medium" style="color: var(--text-primary);">
                Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="pagination-btn flex items-center gap-2">
                Sau
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        </div>
    </div>

    <!-- Report Dialog -->
    <ReportDialog v-model="showReportDialog" @confirm="handleReportConfirm" />

    <!-- Toast Notification -->
    <Toast v-model="showToast" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import CommentService from '@/services/comment.service';
import CommentItem from './CommentItem.vue';
import ReportDialog from './ReportDialog.vue';
import Toast from './Toast.vue';
import { getAvatarUrl } from '@/utils/media';

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

// Report dialog
const showReportDialog = ref(false);
const commentIdToReport = ref(null);

// Toast
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage));

// User avatar URL với fallback
const userAvatarUrl = computed(() => {
    const avatar = authStore.user?.avatar;
    const name = authStore.user?.name || 'User';

    if (avatar) {
        const url = getAvatarUrl(avatar);
        if (url) return url;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
});

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
        showToastMessage('Vui lòng đăng nhập để bình luận!', 'warning');
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
            showToastMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!', 'error');
        } else {
            showToastMessage('Có lỗi xảy ra khi gửi bình luận!', 'error');
        }
    } finally {
        submitting.value = false;
    }
};

// Toggle like
const toggleLike = async (comment) => {
    if (!authStore.isLoggedIn) {
        showToastMessage('Vui lòng đăng nhập để thích bình luận!', 'warning');
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
        showToastMessage('Có lỗi xảy ra khi gửi câu trả lời!', 'error');
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
        showToastMessage('Có lỗi xảy ra khi gửi câu trả lời!', 'error');
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
        showToastMessage('Có lỗi xảy ra!', 'error');
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
        showToastMessage('Có lỗi xảy ra!', 'error');
    }
};

// Report comment
const reportComment = (commentId) => {
    commentIdToReport.value = commentId;
    showReportDialog.value = true;
};

// Handle report confirm
const handleReportConfirm = async (reason) => {
    if (!commentIdToReport.value || !reason.trim()) return;

    try {
        await CommentService.report(commentIdToReport.value, reason.trim());
        showToastMessage('Đã gửi báo cáo. Cảm ơn bạn!', 'success');
    } catch (error) {
        console.error('Report comment error:', error);
        showToastMessage('Có lỗi xảy ra!', 'error');
    } finally {
        commentIdToReport.value = null;
    }
};

// Toast helper
const showToastMessage = (message, type = 'success') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
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
