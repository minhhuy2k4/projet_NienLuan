<template>
    <div class="main-content">
        <div class="content-header animate-fade-in">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Quản lý Truyện</h1>
            <router-link :to="{ name: 'admin.story.add' }"
                class="px-6 py-3 !bg-green-600 hover:!bg-green-700 !text-white font-bold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm truyện mới
            </router-link>
        </div>

        <div class="data-card animate-slide-up">
            <h3>Danh sách truyện</h3>

            <!-- Search and Filter -->
            <div class="search-filter-section">
                <div class="flex-1 relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input v-model="searchQuery" @input="handleSearch" type="text"
                        placeholder="Tìm kiếm theo tên truyện..."
                        class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="filter-info">
                    Tổng: <strong>{{ filteredStories.length }}</strong> truyện
                </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="loading">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="error-message">
                {{ error }}
            </div>

            <!-- Stories list -->
            <div v-else-if="paginatedStories.length > 0">
                <div class="stories-grid">
                    <div v-for="(story, index) in paginatedStories" :key="story._id"
                        class="story-item animate-chapter-in hover:shadow-lg transition-all duration-300"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <div class="story-cover">
                            <img v-if="story.image" :src="getStoryImageUrl(story.image)" :alt="story.name" />
                            <div v-else class="no-cover">📖</div>
                        </div>
                        <div class="story-info">
                            <h4>{{ story.name }}</h4>
                            <p>
                                Tác giả:
                                {{
                                    story.authorDetails
                                        ?.map((author) => author.fullName)
                                        .join(", ") || "Không xác định"
                                }}
                            </p>

                            <p>
                                Thể loại:
                                {{
                                    story.categoryDetails?.map((cat) => cat.name).join(", ") ||
                                    "Không xác định"
                                }}
                            </p>
                            <p>
                                Trạng thái:
                                <span :class="getStatusClass(story.status)">
                                    {{ story.status }}
                                </span>
                            </p>

                            <div class="story-stats">
                                <span class="stat-item inline-flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                    {{ story.chapterCount || 0 }} chương
                                </span>
                                <span class="stat-item inline-flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ story.totalViews || 0 }} lượt xem
                                </span>
                            </div>
                            <div class="story-dates">
                                <small v-if="story.createdAt" class="date-info">
                                    Đăng: {{ formatDate(story.createdAt) }}
                                </small>
                                <small v-if="story.updatedAt && story.updatedAt !== story.createdAt" class="date-info">
                                    Sửa: {{ formatDate(story.updatedAt) }}
                                </small>
                            </div>
                        </div>
                        <div class="story-actions">
                            <router-link :to="{ name: 'admin.story.edit', params: { id: story._id } }"
                                class="px-4 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Sửa
                            </router-link>
                            <router-link :to="{
                                name: 'admin.chapter.manage',
                                params: { storyId: story._id },
                            }"
                                class="px-4 py-2 !bg-purple-600 hover:!bg-purple-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                Chương
                            </router-link>
                            <button @click="deleteStory(story._id)"
                                class="px-4 py-2 !bg-red-600 hover:!bg-red-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-6 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                        ← Trước
                    </button>
                    <div class="px-6 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
                        Trang {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="px-6 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                        Sau →
                    </button>
                </div>

                <!-- Displaying info -->
                <div v-if="paginatedStories.length > 0" class="mt-4 text-center text-sm text-gray-600">
                    Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage,
                        filteredStories.length) }} / Tổng {{ filteredStories.length }} truyện
                </div>
            </div>

            <!-- Empty state -->
            <div v-else class="empty-state">
                <p v-if="searchQuery">
                    Không tìm thấy truyện nào phù hợp với "{{ searchQuery }}"
                </p>
                <p v-else>
                    Chưa có truyện nào.
                    <router-link :to="{ name: 'admin.story.add' }">Thêm truyện đầu tiên</router-link>
                </p>
            </div>
        </div>

        <!-- Confirm Dialog -->
        <ConfirmDialog v-model="showDialog" :title="dialogConfig.title" :message="dialogConfig.message"
            :type="dialogConfig.type" @confirm="dialogConfig.onConfirm" />

        <!-- Toast Notification -->
        <Toast v-model="showToast" :message="toastConfig.message" :type="toastConfig.type" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import storyService from "@/services/story.service";
import { getStoryImageUrl } from '@/utils/media';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Toast from '@/components/Toast.vue';

const stories = ref([]);
const loading = ref(true);
const error = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

// Dialog state
const showDialog = ref(false);
const dialogConfig = ref({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
});

// Toast state
const showToast = ref(false);
const toastConfig = ref({
    message: '',
    type: 'success'
});

// Filtered stories based on search
const filteredStories = computed(() => {
    if (!searchQuery.value) {
        return stories.value;
    }
    const query = searchQuery.value.toLowerCase();
    return stories.value.filter(story =>
        story.name.toLowerCase().includes(query)
    );
});

// Paginated stories
const paginatedStories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStories.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
    return Math.ceil(filteredStories.value.length / itemsPerPage);
});

// Handle search - reset to page 1
const handleSearch = () => {
    currentPage.value = 1;
};

const getStatusClass = (status) => {
    if (status === 'hoàn thành') {
        return 'status-completed';
    }
    return 'status-ongoing';
};

// Hàm format ngày tháng
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const fetchStories = async () => {
    try {
        loading.value = true;
        error.value = "";

        const response = await storyService.getAll();
        stories.value = response || [];
    } catch (err) {
        console.error("Error fetching stories:", err);
        error.value = "Lỗi khi tải danh sách truyện";
    } finally {
        loading.value = false;
    }
};

const deleteStory = async (id) => {
    dialogConfig.value = {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc muốn xóa truyện này?',
        type: 'danger',
        onConfirm: async () => {
            try {
                await storyService.delete(id);
                await fetchStories(); // Refresh list

                dialogConfig.value = {
                    title: 'Thành công',
                    message: 'Xóa truyện thành công!',
                    type: 'success',
                    onConfirm: () => { showDialog.value = false; }
                };
                showDialog.value = true;
            } catch (err) {
                console.error("Error deleting story:", err);
                dialogConfig.value = {
                    title: 'Lỗi',
                    message: 'Lỗi khi xóa truyện',
                    type: 'danger',
                    onConfirm: () => { showDialog.value = false; }
                };
                showDialog.value = true;
            }
        }
    };
    showDialog.value = true;
};

onMounted(() => {
    fetchStories();
});
</script>

<style scoped>
.status-ongoing {
    color: #ffa500;
    /* Orange */
    font-weight: bold;
}

.status-completed {
    color: #28a745;
    /* Green */
    font-weight: bold;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.stories-grid {
    display: grid;
    gap: 1rem;
}

.story-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    transition: box-shadow 0.3s;
}

.story-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.story-cover {
    width: 80px;
    height: 120px;
    flex-shrink: 0;
}

.story-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border-light);
}

.no-cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 6px;
    font-size: 2rem;
    color: white;
}

.story-info {
    flex: 1;
}

.story-info h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
}

.story-info p {
    margin: 0.25rem 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.story-dates {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.date-info {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-style: italic;
}

.story-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 0.5rem 0;
}

.stat-item {
    font-size: 0.8rem;
    color: var(--text-secondary);
    background: #f8f9fa;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
}

.story-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-edit,
.btn-chapters,
.btn-delete {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: none;
    display: inline-block;
    text-align: center;
}

.btn-edit {
    background-color: #28a745;
    color: white;
}

.btn-chapters {
    background-color: #007bff;
    color: white;
}

.btn-delete {
    background-color: #dc3545;
    color: white;
}

.btn-edit:hover,
.btn-delete:hover {
    opacity: 0.8;
}

.empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

/* Search and Filter Section */
.search-filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.search-box {
    flex: 1;
    min-width: 250px;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filter-info {
    padding: 0.75rem 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

/* Pagination */
/* Pagination styles now use utility classes for consistency with other admin pages */
</style>
