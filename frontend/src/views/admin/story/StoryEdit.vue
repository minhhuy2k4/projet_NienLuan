<template>
    <main class="main-content">
        <header class="content-header">
            <h2>Chỉnh sửa truyện</h2>
            <router-link :to="{ name: 'admin.story.list' }"
                class="px-6 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-md">
                ← Quay lại danh sách
            </router-link>
        </header>

        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Đang tải...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
        </div>

        <div v-else-if="story" class="edit-container">
            <!-- Story Info Card -->
            <div class="story-info-card">
                <div class="cover-section">
                    <div class="cover-image-wrapper">
                        <img v-if="coverPreview || story.image" :src="coverPreview || getStoryImageUrl(story.image)"
                            alt="Cover" class="cover-image" />
                        <div v-else class="no-cover">
                            <span>📖</span>
                            <p>Chưa có ảnh bìa</p>
                        </div>
                    </div>
                    <div class="cover-actions">
                        <input type="file" id="coverInput" @change="handleCoverSelect" accept="image/*"
                            class="file-input" />
                        <label for="coverInput"
                            class="px-4 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-md cursor-pointer inline-flex items-center gap-2">
                            📷 Chọn ảnh bìa mới
                        </label>
                        <button v-if="coverFile" @click="uploadCover"
                            class="px-4 py-2 !bg-green-600 hover:!bg-green-700 !text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-md disabled:opacity-50"
                            :disabled="uploading">
                            {{ uploading ? 'Đang upload...' : '✓ Lưu ảnh bìa' }}
                        </button>
                    </div>
                </div>

                <div class="story-stats">
                    <div class="stat-item">
                        <span class="stat-label">Số chương</span>
                        <span class="stat-value">{{ story.chapters?.length || 0 }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Lượt xem</span>
                        <span class="stat-value">{{ story.totalViews || 0 }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Trạng thái</span>
                        <span class="stat-value">{{ story.status || 'Đang cập nhật' }}</span>
                    </div>
                </div>

                <router-link :to="{ name: 'admin.chapter.manage', params: { storyId: story._id } }"
                    class="px-6 py-3 !bg-purple-600 hover:!bg-purple-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md inline-flex items-center justify-center gap-2">
                    📚 Quản lý chương
                </router-link>
            </div>

            <!-- Edit Form -->
            <div class="edit-form-card">
                <form @submit.prevent="handleStoryUpdate">
                    <h3>Thông tin truyện</h3>

                    <div class="form-group">
                        <label for="name">Tên truyện <span class="required">*</span></label>
                        <input type="text" id="name" v-model="story.name" required placeholder="Nhập tên truyện" />
                    </div>

                    <div class="form-group">
                        <label for="description">Mô tả</label>
                        <textarea id="description" v-model="story.description" rows="6"
                            placeholder="Mô tả nội dung truyện..."></textarea>
                    </div>

                    <h3>Phân loại</h3>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="authors">Tác giả <span class="required">*</span></label>
                            <select id="authors" v-model="story.authors" multiple required>
                                <option v-for="author in authorList" :key="author._id" :value="author._id">
                                    {{ author.fullName }}
                                </option>
                            </select>
                            <small>Giữ Ctrl/Cmd để chọn nhiều</small>
                        </div>

                        <div class="form-group">
                            <label for="categories">Thể loại <span class="required">*</span></label>
                            <select id="categories" v-model="story.categories" multiple required>
                                <option v-for="cat in categoryList" :key="cat._id" :value="cat._id">
                                    {{ cat.name }}
                                </option>
                            </select>
                            <small>Giữ Ctrl/Cmd để chọn nhiều</small>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="status">Trạng thái</label>
                        <select id="status" v-model="story.status">
                            <option value="đang tiến hành">Đang tiến hành</option>
                            <option value="hoàn thành">Hoàn thành</option>
                        </select>
                    </div>

                    <div class="form-actions">
                        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                        <button type="submit"
                            class="px-6 py-3 !bg-green-600 hover:!bg-green-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md disabled:opacity-50"
                            :disabled="loadingSubmit">
                            {{ loadingSubmit ? 'Đang lưu...' : '✓ Lưu thay đổi' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Confirm Dialog -->
        <ConfirmDialog v-model="showDialog" :title="dialogConfig.title" :message="dialogConfig.message"
            :type="dialogConfig.type" @confirm="dialogConfig.onConfirm" />

        <!-- Toast Notification -->
        <Toast v-model="showToast" :message="toastConfig.message" :type="toastConfig.type" />
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import storyService from '@/services/story.service';
import authorService from '@/services/author.service';
import categoryService from '@/services/category.service';
import { getStoryImageUrl } from '@/utils/media';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Toast from '@/components/Toast.vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const story = ref(null);
const authorList = ref([]);
const categoryList = ref([]);
const coverFile = ref(null);
const coverPreview = ref(null);

const loading = ref(true);
const loadingSubmit = ref(false);
const uploading = ref(false);
const error = ref(null);
const successMessage = ref('');

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

onMounted(async () => {
    try {
        const [storyData, authors, categories] = await Promise.all([
            storyService.get(props.id),
            authorService.getAll(),
            categoryService.getAll()
        ]);

        story.value = storyData;
        authorList.value = authors;
        categoryList.value = categories;

        // Đảm bảo arrays không null
        story.value.authors = storyData.authors ? (Array.isArray(storyData.authors) ? storyData.authors : [storyData.authors]) : [];
        story.value.categories = storyData.categories ? (Array.isArray(storyData.categories) ? storyData.categories : [storyData.categories]) : [];
    } catch (err) {
        console.error('Load data error:', err);
        error.value = 'Không thể tải dữ liệu truyện.';
    } finally {
        loading.value = false;
    }
});

const handleCoverSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
        toastConfig.value = {
            message: 'Kích thước ảnh không được vượt quá 5MB',
            type: 'warning'
        };
        showToast.value = true;
        return;
    }

    if (!file.type.startsWith('image/')) {
        toastConfig.value = {
            message: 'Vui lòng chọn file ảnh',
            type: 'warning'
        };
        showToast.value = true;
        return;
    }

    coverFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        coverPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const uploadCover = async () => {
    if (!coverFile.value) return;

    try {
        uploading.value = true;
        const formData = new FormData();
        formData.append('coverImage', coverFile.value);

        const result = await storyService.uploadCover(props.id, formData);
        story.value.image = result.imageUrl;
        coverFile.value = null;
        coverPreview.value = null;

        // Reset input
        const input = document.getElementById('coverInput');
        if (input) input.value = '';

        toastConfig.value = {
            message: 'Upload ảnh bìa thành công!',
            type: 'success'
        };
        showToast.value = true;
    } catch (err) {
        console.error('Upload cover error:', err);
        toastConfig.value = {
            message: 'Lỗi khi upload ảnh bìa',
            type: 'error'
        };
        showToast.value = true;
    } finally {
        uploading.value = false;
    }
};

const handleStoryUpdate = async () => {
    loadingSubmit.value = true;
    successMessage.value = '';

    try {
        await storyService.update(props.id, {
            name: story.value.name,
            description: story.value.description,
            authors: story.value.authors,
            categories: story.value.categories,
            status: story.value.status
        });

        successMessage.value = 'Cập nhật truyện thành công!';
        setTimeout(() => successMessage.value = '', 3000);
    } catch (err) {
        console.error('Update story error:', err);
        error.value = 'Lỗi khi cập nhật truyện.';
    } finally {
        loadingSubmit.value = false;
    }
};
</script>

<style scoped>
.loading-state,
.error-state {
    text-align: center;
    padding: 3rem;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.edit-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    max-width: 1200px;
}

/* Story Info Card */
.story-info-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 20px;
}

.cover-section {
    margin-bottom: 1.5rem;
}

.cover-image-wrapper {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
    background: #f5f5f5;
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-cover {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #bbb;
}

.no-cover span {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

.file-input {
    display: none;
}

.cover-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.btn-upload,
.btn-save-cover {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
}

.btn-upload {
    background: #ecf0f1;
    color: #2c3e50;
}

.btn-upload:hover {
    background: #d5dbdb;
}

.btn-save-cover {
    background: #27ae60;
    color: white;
}

.btn-save-cover:hover:not(:disabled) {
    background: #229954;
}

.btn-save-cover:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.story-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.6rem;
    background: #fbfcfd;
    border-radius: 6px;
}

.stat-item {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.5rem;
}

.stat-label {
    font-size: 0.75rem;
    color: #7f8c8d;
    margin: 0;
}

.stat-value {
    font-size: clamp(0.75rem, 1.2vw, 1rem);
    font-weight: 500;
    color: #2c3e50;
    line-height: 1.05;
    white-space: nowrap;
    margin: 0;
}

.stat-value[data-type="status"] {
    white-space: normal;
    text-align: right;
    font-size: clamp(0.75rem, 1.1vw, 0.95rem);
}

@media (max-width: 480px) {
    .stat-value {
        font-size: 0.95rem;
    }
}

.btn-manage-chapters {
    display: block;
    padding: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-manage-chapters:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Edit Form Card */
.edit-form-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-form-card h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.2rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #3498db;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.95rem;
}

.required {
    color: #e74c3c;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #3498db;
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
}

.form-group select[multiple] {
    height: 150px;
}

.form-group small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.85rem;
    color: #7f8c8d;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
}

.form-actions {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #ecf0f1;
    text-align: right;
}

.btn-submit {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.success-message,
.error-message {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 500;
}

.success-message {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.nav-back-button {
    font-size: 0.95rem;
    font-weight: 500;
    color: #3498db;
    text-decoration: none;
    transition: color 0.2s;
}

.nav-back-button:hover {
    color: #2980b9;
}

/* Responsive */
@media (max-width: 992px) {
    .edit-container {
        grid-template-columns: 1fr;
    }

    .story-info-card {
        position: static;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>