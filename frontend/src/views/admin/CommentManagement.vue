<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Quản lý Bình luận & Báo cáo</h1>

        <!-- Tabs -->
        <div class="flex gap-4 mb-6 border-b">
            <button @click="activeTab = 'comments'" :class="tabClass('comments')"
                class="px-6 py-3 font-semibold transition flex items-center gap-2">
                <span class="text-xl">💬</span>
                <span>Tất cả bình luận</span>
            </button>
            <button @click="activeTab = 'reports'" :class="tabClass('reports')"
                class="px-6 py-3 font-semibold transition flex items-center gap-2">
                <span class="text-xl">🚩</span>
                <span>Báo cáo ({{ reportStats.total || 0 }})</span>
            </button>
        </div>

        <!-- Reports Tab -->
        <div v-if="activeTab === 'reports'">
            <!-- Loading -->
            <div v-if="loading" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>

            <!-- Reports List -->
            <div v-else-if="reports && reports.length > 0" class="space-y-4">
                <div v-for="report in reports" :key="report._id"
                    class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                    <!-- Report Header -->
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-sm text-gray-500">{{ formatDate(report.createdAt) }}</span>
                            </div>
                            <p class="text-gray-700"><strong>Lý do:</strong> {{ report.reason }}</p>
                            <p class="text-sm text-gray-600 mt-1">
                                <strong>Người báo cáo:</strong> {{ report.reportedBy?.name || 'Unknown' }} ({{
                                    report.reportedBy?.email }})
                            </p>
                        </div>
                    </div>

                    <!-- Comment Content -->
                    <div class="bg-gray-50 border-l-4 border-orange-500 p-4 rounded mb-4">
                        <div class="flex items-center gap-2 mb-2">
                            <div
                                class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold">
                                {{ report.comment?.user?.name?.charAt(0).toUpperCase() || '?' }}
                            </div>
                            <div>
                                <p class="font-semibold text-sm">{{ report.comment?.user?.name || 'Anonymous' }}</p>
                                <p class="text-xs text-gray-500">{{ formatDate(report.comment?.createdAt) }}</p>
                            </div>
                        </div>
                        <p class="text-gray-800 whitespace-pre-line">{{ report.comment?.content || '[Đã xóa]' }}</p>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3">
                        <button @click="deleteReportedComment(report._id, report.comment?._id)"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                            🗑️ Xóa bình luận
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
                <span class="text-6xl mb-4 block">📭</span>
                <p class="text-gray-600 text-lg">Không có báo cáo nào</p>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-4">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                    ← Trước
                </button>
                <span class="text-gray-700 font-medium">Trang {{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                    Sau →
                </button>
            </div>
        </div>

        <!-- Comments Tab -->
        <div v-if="activeTab === 'comments'">
            <!-- Search & Filter -->
            <div class="flex gap-4 mb-6">
                <input v-model="searchQuery" @input="debounceSearch" placeholder="Tìm kiếm bình luận..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <button @click="loadComments"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                    🔍 Tìm
                </button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>

            <!-- Comments List -->
            <div v-else-if="allComments && allComments.length > 0" class="space-y-4">
                <div v-for="comment in allComments" :key="comment._id"
                    class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                    <!-- Comment Header -->
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                                {{ comment.user?.name?.charAt(0).toUpperCase() || '?' }}
                            </div>
                            <div>
                                <p class="font-semibold">{{ comment.user?.name || 'Anonymous' }}</p>
                                <p class="text-sm text-gray-500">{{ comment.user?.email }}</p>
                                <p class="text-xs text-gray-400">{{ formatDate(comment.createdAt) }}</p>
                            </div>
                        </div>
                        <button @click="deleteComment(comment._id)"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                            🗑️ Xóa
                        </button>
                    </div>

                    <!-- Comment Content -->
                    <div class="bg-gray-50 p-4 rounded mb-3">
                        <p class="text-gray-800 whitespace-pre-line">{{ comment.content }}</p>
                    </div>

                    <!-- Stats -->
                    <div class="flex gap-6 text-sm text-gray-600">
                        <span>❤️ {{ comment.likeCount || 0 }} lượt thích</span>
                        <span>💬 {{ comment.replyCount || 0 }} trả lời</span>
                        <span>🚩 {{ comment.reportCount || 0 }} báo cáo</span>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
                <span class="text-6xl mb-4 block">💬</span>
                <p class="text-gray-600 text-lg">Không tìm thấy bình luận nào</p>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-4">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                    ← Trước
                </button>
                <span class="text-gray-700 font-medium">Trang {{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                    Sau →
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import CommentService from '@/services/comment.service';

const authStore = useAuthStore();

// State
const activeTab = ref('comments');
const loading = ref(false);
const reports = ref([]);
const allComments = ref([]);
const reportStats = ref({});
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 10;

let searchTimeout = null;

// Tab class
const tabClass = (tab) => {
    return activeTab.value === tab
        ? 'border-b-2 border-blue-600 text-blue-600'
        : 'text-gray-600 hover:text-blue-600';
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Load reports
const loadReports = async () => {
    try {
        loading.value = true;
        console.log('Loading reports - page:', currentPage.value);
        const response = await CommentService.getReportedComments(currentPage.value, itemsPerPage);
        console.log('Reports response:', response);
        reports.value = response.data?.reports || [];
        totalPages.value = response.data?.pagination?.totalPages || 1;
        console.log('Reports loaded:', reports.value.length, 'items');
    } catch (error) {
        console.error('Load reports error:', error);
        reports.value = [];
        totalPages.value = 1;
        alert('❌ Không thể tải danh sách báo cáo!');
    } finally {
        loading.value = false;
    }
};

// Load report stats
const loadReportStats = async () => {
    try {
        const response = await CommentService.getReportStats();
        reportStats.value = response.data || {};
    } catch (error) {
        console.error('Load report stats error:', error);
        reportStats.value = {};
    }
};

// Delete reported comment (xóa comment và tất cả reports liên quan)
const deleteReportedComment = async (reportId, commentId) => {
    if (!confirm('🗑️ Bạn có chắc muốn XÓA bình luận này? Tất cả báo cáo liên quan cũng sẽ bị xóa.')) return;

    try {
        // Xóa comment (sẽ tự động xóa tất cả reports liên quan)
        if (commentId) {
            await CommentService.delete(commentId);
        }
        alert('✅ Đã xóa bình luận và báo cáo!');
        await loadReports();
        await loadReportStats();
    } catch (error) {
        console.error('Delete reported comment error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Load all comments
const loadComments = async () => {
    try {
        loading.value = true;
        const response = await CommentService.getAllComments(currentPage.value, itemsPerPage, searchQuery.value);
        allComments.value = response.data?.comments || [];
        totalPages.value = response.data?.pagination?.totalPages || 1;
    } catch (error) {
        console.error('Load comments error:', error);
        allComments.value = [];
        totalPages.value = 1;
        alert('❌ Không thể tải danh sách bình luận!');
    } finally {
        loading.value = false;
    }
};

// Delete comment
const deleteComment = async (commentId) => {
    if (!confirm('🗑️ Bạn có chắc muốn xóa bình luận này?')) return;

    try {
        await CommentService.delete(commentId);
        alert('✅ Đã xóa bình luận!');
        await loadComments();
    } catch (error) {
        console.error('Delete comment error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Debounce search
const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        loadComments();
    }, 500);
};

// Pagination
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        activeTab.value === 'reports' ? loadReports() : loadComments();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        activeTab.value === 'reports' ? loadReports() : loadComments();
    }
};

// Init
onMounted(() => {
    loadComments(); // Load comments first (default tab)
    loadReportStats(); // Load report stats for badge count
});

// Watch tab changes
watch(activeTab, (newTab) => {
    currentPage.value = 1; // Reset về trang 1
    if (newTab === 'comments') {
        loadComments();
    } else if (newTab === 'reports') {
        loadReports();
    }
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
