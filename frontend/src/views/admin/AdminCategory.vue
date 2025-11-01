<template>
    <main class="main-content">
        <header class="content-header animate-fade-in">
            <h2>Quản lý Thể loại</h2>
        </header>
        <div class="main-data-grid">
            <div class="data-card animate-slide-up">
                <h3>{{ editingCategory ? 'Sửa thể loại' : 'Thêm thể loại mới' }}</h3>
                <form @submit.prevent="handleSubmit" class="form-simple">
                    <div class="form-group">
                        <label for="name">Tên thể loại</label>
                        <input type="text" id="name" v-model="formData.name" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Mô tả (tùy chọn)</label>
                        <textarea id="description" v-model="formData.description" rows="3"></textarea>
                    </div>
                    <p v-if="error" class="error-message">{{ error }}</p>
                    <div class="button-group">
                        <button type="submit" class="submit-button transform hover:scale-105 transition"
                            :disabled="loading">
                            {{ loading ? 'Đang lưu...' : (editingCategory ? 'Cập nhật' : 'Lưu') }}
                        </button>
                        <button v-if="editingCategory" type="button"
                            class="cancel-button transform hover:scale-105 transition" @click="cancelEdit">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
            <div class="data-card list-card animate-slide-up" style="animation-delay: 0.1s">
                <h3>Danh sách thể loại</h3>

                <!-- Search Box -->
                <div class="search-filter-section">
                    <div class="search-box">
                        <input v-model="searchQuery" @input="handleSearch" type="text"
                            placeholder="🔍 Tìm kiếm thể loại..." class="search-input" />
                    </div>
                    <div class="filter-info">
                        Tổng: <strong>{{ filteredCategories.length }}</strong> thể loại
                    </div>
                </div>

                <ul v-if="paginatedCategories.length > 0" class="item-list">
                    <li v-for="(cat, index) in paginatedCategories" :key="cat._id"
                        class="item-row animate-chapter-in hover:shadow-md transition-all duration-300"
                        :style="{ animationDelay: `${index * 50}ms` }">
                        <div class="item-info">
                            <strong>{{ cat.name }}</strong>
                            <p v-if="cat.description" class="category-description">{{ cat.description }}</p>
                        </div>
                        <div class="item-actions">
                            <button @click="editCategory(cat)" class="edit-btn transform hover:scale-105 transition"
                                title="Sửa">
                                Sửa
                            </button>
                            <button @click="deleteCategory(cat._id)"
                                class="delete-btn transform hover:scale-105 transition" title="Xóa">
                                Xóa
                            </button>
                        </div>
                    </li>
                </ul>
                <p v-else-if="searchQuery">Không tìm thấy thể loại nào phù hợp với "{{ searchQuery }}"</p>
                <p v-else>Chưa có thể loại nào.</p>

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
import categoryService from '@/services/category.service';

const categoryList = ref([]);
const formData = ref({ name: '', description: '' });
const editingCategory = ref(null);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Filtered categories based on search
const filteredCategories = computed(() => {
    if (!searchQuery.value) {
        return categoryList.value;
    }
    const query = searchQuery.value.toLowerCase();
    return categoryList.value.filter(cat =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );
});

// Paginated categories
const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCategories.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
    return Math.ceil(filteredCategories.value.length / itemsPerPage);
});

// Handle search
const handleSearch = () => {
    currentPage.value = 1; // Reset to first page on search
};

async function fetchCategories() {
    try {
        console.log('Fetching categories...');
        categoryList.value = await categoryService.getAll();
        console.log('Categories loaded:', categoryList.value);
    }
    catch (err) {
        console.error('Error fetching categories:', err);
        error.value = 'Lỗi tải danh sách thể loại.';
    }
}

onMounted(fetchCategories);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        if (editingCategory.value) {
            // Cập nhật thể loại
            console.log('Updating category:', formData.value);
            const updated = await categoryService.update(editingCategory.value, formData.value);
            console.log('Category updated:', updated);

            const index = categoryList.value.findIndex(c => c._id === editingCategory.value);
            if (index !== -1) {
                categoryList.value[index] = updated;
            }
            editingCategory.value = null;
        } else {
            // Tạo thể loại mới
            console.log('Creating category:', formData.value);
            const created = await categoryService.create(formData.value);
            console.log('Category created:', created);
            categoryList.value.push(created);
        }

        formData.value = { name: '', description: '' };
    } catch (err) {
        console.error('Error saving category:', err);
        error.value = 'Lỗi khi lưu thể loại.';
    }
    finally {
        loading.value = false;
    }
};

const editCategory = (category) => {
    editingCategory.value = category._id;
    formData.value = {
        name: category.name,
        description: category.description || ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
    editingCategory.value = null;
    formData.value = { name: '', description: '' };
    error.value = null;
};

const deleteCategory = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
        return;
    }

    try {
        await categoryService.delete(id);
        categoryList.value = categoryList.value.filter(c => c._id !== id);

        if (editingCategory.value === id) {
            cancelEdit();
        }

        // Hiển thị thông báo thành công
        alert('✅ Xóa thể loại thành công!');
    } catch (err) {
        console.error('Error deleting category:', err);

        // Hiển thị thông báo lỗi chi tiết từ backend
        let errorMessage = 'Lỗi khi xóa thể loại.';

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
.category-description {
    margin: 0.5rem 0 0 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

textarea {
    resize: vertical;
    min-height: 60px;
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