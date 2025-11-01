<template>
    <main class="main-content">
        <header class="content-header animate-fade-in">
            <h2>Quản lý Tác giả</h2>
        </header>
        <div class="main-data-grid">
            <div class="data-card animate-slide-up">
                <h3>{{ editingAuthor ? 'Sửa tác giả' : 'Thêm tác giả mới' }}</h3>
                <form @submit.prevent="handleSubmit" class="form-simple">
                    <div class="form-group">
                        <label for="fullName">Tên tác giả</label>
                        <input type="text" id="fullName" v-model="formData.fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="formData.email">
                    </div>
                    <div class="form-group">
                        <label for="bio">Tiểu sử</label>
                        <textarea id="bio" v-model="formData.bio" rows="3"></textarea>
                    </div>
                    <p v-if="error" class="error-message">{{ error }}</p>
                    <div class="button-group">
                        <button type="submit" class="submit-button transform hover:scale-105 transition"
                            :disabled="loading">
                            {{ loading ? 'Đang lưu...' : (editingAuthor ? 'Cập nhật' : 'Lưu') }}
                        </button>
                        <button v-if="editingAuthor" type="button"
                            class="cancel-button transform hover:scale-105 transition" @click="cancelEdit">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
            <div class="data-card list-card animate-slide-up" style="animation-delay: 0.1s">
                <h3>Danh sách tác giả</h3>

                <!-- Search Box -->
                <div class="search-filter-section">
                    <div class="search-box">
                        <input v-model="searchQuery" @input="handleSearch" type="text"
                            placeholder="🔍 Tìm kiếm tác giả..." class="search-input" />
                    </div>
                    <div class="filter-info">
                        Tổng: <strong>{{ filteredAuthors.length }}</strong> tác giả
                    </div>
                </div>

                <ul v-if="paginatedAuthors.length > 0" class="item-list">
                    <li v-for="(author, index) in paginatedAuthors" :key="author._id"
                        class="item-row animate-chapter-in hover:shadow-md transition-all duration-300"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <div class="item-info">
                            <strong>{{ author.fullName }}</strong>
                            <span v-if="author.email" class="author-email">{{ author.email }}</span>
                            <p v-if="author.bio" class="author-bio">{{ author.bio }}</p>
                        </div>
                        <div class="item-actions">
                            <button @click="editAuthor(author)" class="edit-btn transform hover:scale-105 transition"
                                title="Sửa">
                                Sửa
                            </button>
                            <button @click="deleteAuthor(author._id)"
                                class="delete-btn transform hover:scale-105 transition" title="Xóa">
                                Xóa
                            </button>
                        </div>
                    </li>
                </ul>
                <p v-else-if="searchQuery">Không tìm thấy tác giả nào phù hợp với "{{ searchQuery }}"</p>
                <p v-else>Chưa có tác giả nào.</p>

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
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import authorService from '@/services/author.service';

const authorList = ref([]);
const formData = ref({ fullName: '', email: '', bio: '' });
const editingAuthor = ref(null);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Filtered authors based on search
const filteredAuthors = computed(() => {
    if (!searchQuery.value) {
        return authorList.value;
    }
    const query = searchQuery.value.toLowerCase();
    return authorList.value.filter(author =>
        author.fullName.toLowerCase().includes(query) ||
        (author.email && author.email.toLowerCase().includes(query))
    );
});

// Paginated authors
const paginatedAuthors = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAuthors.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
    return Math.ceil(filteredAuthors.value.length / itemsPerPage);
});

// Handle search
const handleSearch = () => {
    currentPage.value = 1; // Reset to first page on search
};

async function fetchAuthors() {
    try {
        console.log('Fetching authors...');
        authorList.value = await authorService.getAll();
        console.log('Authors loaded:', authorList.value);
    }
    catch (err) {
        console.error('Error fetching authors:', err);
        error.value = 'Lỗi tải danh sách tác giả.';
    }
}

onMounted(fetchAuthors);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        if (editingAuthor.value) {
            // Cập nhật tác giả
            console.log('Updating author:', formData.value);
            const updated = await authorService.update(editingAuthor.value, formData.value);
            console.log('Author updated:', updated);

            const index = authorList.value.findIndex(a => a._id === editingAuthor.value);
            if (index !== -1) {
                authorList.value[index] = updated;
            }
            editingAuthor.value = null;
        } else {
            // Tạo tác giả mới
            console.log('Creating author:', formData.value);
            const created = await authorService.create(formData.value);
            console.log('Author created:', created);
            authorList.value.push(created);
        }

        formData.value = { fullName: '', email: '', bio: '' };
    } catch (err) {
        console.error('Error saving author:', err);
        error.value = 'Lỗi khi lưu tác giả.';
    }
    finally {
        loading.value = false;
    }
};

const editAuthor = (author) => {
    editingAuthor.value = author._id;
    formData.value = {
        fullName: author.fullName,
        email: author.email || '',
        bio: author.bio || ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
    editingAuthor.value = null;
    formData.value = { fullName: '', email: '', bio: '' };
    error.value = null;
};

const deleteAuthor = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
        return;
    }

    try {
        await authorService.delete(id);
        authorList.value = authorList.value.filter(a => a._id !== id);

        if (editingAuthor.value === id) {
            cancelEdit();
        }

        // Hiển thị thông báo thành công
        alert('✅ Xóa tác giả thành công!');
    } catch (err) {
        console.error('Error deleting author:', err);

        // Hiển thị thông báo lỗi chi tiết từ backend
        let errorMessage = 'Lỗi khi xóa tác giả.';

        if (err.response) {
            // Lỗi từ backend (400, 404, 500...)
            if (err.response.status === 400 && err.response.data?.message) {
                // Lỗi "có truyện đang dùng"
                errorMessage = err.response.data.message;
            } else if (err.response.data?.message) {
                errorMessage = err.response.data.message;
            }
        }

        alert('❌ ' + errorMessage);
    }
};
</script>

<style scoped>
.author-email {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-left: 0.5rem;
}

.author-bio {
    margin: 0.5rem 0 0 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.item-info {
    flex: 1;
}

.item-actions {
    display: flex;
    gap: 0.5rem;
}

.edit-btn,
.delete-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
}

.edit-btn {
    background-color: #4CAF50;
}

.edit-btn:hover {
    background-color: #45a049;
    transform: scale(1.1);
}

.delete-btn {
    background-color: #f44336;
}

.delete-btn:hover {
    background-color: #da190b;
    transform: scale(1.1);
}

.button-group {
    display: flex;
    gap: 1rem;
}

.cancel-button {
    padding: 0.75rem 1.5rem;
    background-color: #999;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.cancel-button:hover {
    background-color: #777;
}

textarea {
    resize: vertical;
    min-height: 60px;
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
    min-width: 200px;
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
    white-space: nowrap;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem 0;
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
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
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