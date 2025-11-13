<template>
    <div class="main-content">
        <div class="content-header animate-fade-in">
            <h2>Quản lý Truyện</h2>
            <router-link :to="{ name: 'admin.story.add' }" class="submit-button transform hover:scale-105 transition">
                + Thêm truyện mới
            </router-link>
        </div>

        <div class="data-card animate-slide-up">
            <h3>Danh sách truyện</h3>

            <!-- Search and Filter -->
            <div class="search-filter-section">
                <div class="search-box">
                    <input v-model="searchQuery" @input="handleSearch" type="text"
                        placeholder="🔍 Tìm kiếm theo tên truyện..." class="search-input" />
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
                                <span class="stat-item">📚 {{ story.chapterCount || 0 }} chương</span>
                                <span class="stat-item">👁️ {{ story.totalViews || 0 }} lượt xem</span>
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
                                class="btn-edit transform hover:scale-105 transition">
                                Sửa
                            </router-link>
                            <router-link :to="{
                                name: 'admin.chapter.manage',
                                params: { storyId: story._id },
                            }" class="btn-chapters transform hover:scale-105 transition">
                                Chương
                            </router-link>
                            <button @click="deleteStory(story._id)"
                                class="btn-delete transform hover:scale-105 transition">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                        ← Trước
                    </button>
                    <span class="page-info">
                        Trang {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
                        Sau →
                    </button>
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import storyService from "@/services/story.service";
import { getStoryImageUrl } from '@/utils/media';

const stories = ref([]);
const loading = ref(true);
const error = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

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
    if (confirm("Bạn có chắc muốn xóa truyện này?")) {
        try {
            await storyService.delete(id);
            await fetchStories(); // Refresh list
        } catch (err) {
            console.error("Error deleting story:", err);
            alert("Lỗi khi xóa truyện");
        }
    }
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
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1rem;
}

.page-btn {
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
    background-color: #2980b9;
    transform: scale(1.05);
}

.page-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.page-info {
    font-weight: 600;
    color: var(--text-primary);
    min-width: 120px;
    text-align: center;
}
</style>
