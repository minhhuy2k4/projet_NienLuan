<template>
    <main class="main-content">
        <header class="content-header animate-fade-in">
            <h2>Thêm Truyện Mới</h2>
            <router-link :to="{ name: 'admin.story.list' }"
                class="nav-back-button transform hover:scale-105 transition">
                ← Quay lại danh sách
            </router-link>
        </header>

        <div class="form-container">
            <form @submit.prevent="handleSubmit" class="story-form">
                <!-- Ảnh bìa -->
                <div class="form-card cover-section animate-slide-up">
                    <h3>Ảnh bìa truyện</h3>
                    <div class="cover-upload-area">
                        <div v-if="coverPreview" class="cover-preview">
                            <img :src="coverPreview" alt="Preview" class="animate-fade-in" />
                            <button type="button" @click="removeCover"
                                class="remove-cover-btn hover:scale-110 transition">✕</button>
                        </div>
                        <div v-else class="upload-placeholder">
                            <input type="file" id="coverInput" @change="handleCoverSelect" accept="image/*"
                                class="file-input" />
                            <label for="coverInput" class="upload-label hover:bg-blue-50 transition">
                                <span class="upload-icon">📷</span>
                                <span>Chọn ảnh bìa</span>
                                <small>PNG, JPG tối đa 5MB</small>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Thông tin cơ bản -->
                <div class="form-card animate-slide-up animation-delay-100">
                    <h3>Thông tin truyện</h3>
                    <div class="form-group">
                        <label for="name">Tên truyện <span class="required">*</span></label>
                        <input type="text" id="name" v-model="story.name" placeholder="Nhập tên truyện" required
                            class="focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                    <div class="form-group">
                        <label for="description">Mô tả</label>
                        <textarea id="description" v-model="story.description" rows="5"
                            placeholder="Mô tả nội dung truyện..."
                            class="focus:ring-2 focus:ring-blue-500 transition"></textarea>
                    </div>
                </div>

                <!-- Metadata -->
                <div class="form-card animate-slide-up animation-delay-200">
                    <h3>Phân loại</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="authors">Tác giả <span class="required">*</span></label>
                            <select id="authors" v-model="story.authors" multiple required>
                                <option v-for="author in authorList" :key="author._id" :value="author._id">
                                    {{ author.fullName }}
                                </option>
                            </select>
                            <small>Giữ Ctrl/Cmd để chọn nhiều tác giả</small>
                        </div>
                        <div class="form-group">
                            <label for="categories">Thể loại <span class="required">*</span></label>
                            <select id="categories" v-model="story.categories" multiple required>
                                <option v-for="cat in categoryList" :key="cat._id" :value="cat._id">
                                    {{ cat.name }}
                                </option>
                            </select>
                            <small>Giữ Ctrl/Cmd để chọn nhiều thể loại</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="status">Trạng thái</label>
                        <select id="status" v-model="story.status">
                            <option value="đang tiến hành">Đang tiến hành</option>
                            <option value="hoàn thành">Hoàn thành</option>
                        </select>
                    </div>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                    <div class="button-group">
                        <button type="button" @click="$router.back()" class="btn-cancel">
                            Hủy
                        </button>
                        <button type="submit" class="btn-submit" :disabled="loading">
                            {{ loading ? 'Đang lưu...' : 'Tạo truyện' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import storyService from '@/services/story.service';
import authorService from '@/services/author.service';
import categoryService from '@/services/category.service';
import { getStoryImageUrl } from '@/utils/media';

const router = useRouter();
const story = ref({
    name: '',
    description: '',
    image: '',
    authors: [],
    categories: [],
    status: 'đang tiến hành'
});
const authorList = ref([]);
const categoryList = ref([]);
const coverFile = ref(null);
const coverPreview = ref(null);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
    try {
        authorList.value = await authorService.getAll();
        categoryList.value = await categoryService.getAll();
    } catch (error) {
        errorMessage.value = 'Không thể tải danh sách Tác giả/Thể loại.';
    }
});

const handleCoverSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = 'Kích thước ảnh không được vượt quá 5MB';
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Vui lòng chọn file ảnh';
        return;
    }

    coverFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        coverPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    errorMessage.value = '';
};

const removeCover = () => {
    coverFile.value = null;
    coverPreview.value = null;
    const input = document.getElementById('coverInput');
    if (input) input.value = '';
};

const handleSubmit = async () => {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    try {
        // Debug: Log data trước khi gửi
        console.log('Story data to submit:', story.value);
        console.log('Authors:', story.value.authors);
        console.log('Categories:', story.value.categories);

        // 1. Tạo truyện trước
        const newStory = await storyService.create(story.value);

        // 2. Upload ảnh bìa nếu có
        if (coverFile.value) {
            try {
                const formData = new FormData();
                formData.append('coverImage', coverFile.value);

                const uploadResult = await storyService.uploadCover(newStory._id, formData);
                newStory.image = uploadResult.imageUrl;
            } catch (uploadError) {
                console.error('Upload cover error:', uploadError);
                // Không fail toàn bộ, chỉ thông báo
                errorMessage.value = 'Truyện đã tạo nhưng upload ảnh bìa thất bại. Bạn có thể upload lại sau.';
            }
        }

        successMessage.value = 'Thêm truyện thành công!';

        // Redirect sau 1.5s
        setTimeout(() => {
            router.push({ name: 'admin.story.edit', params: { id: newStory._id } });
        }, 1500);
    } catch (error) {
        console.error('Create story error:', error);
        errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi khi thêm truyện.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-container {
    max-width: 900px;
    margin: 0 auto;
}

.story-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-card h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.2rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #3498db;
}

/* Cover Upload Section */
.cover-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.cover-section h3 {
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.3);
}

.cover-upload-area {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-placeholder {
    width: 100%;
    text-align: center;
}

.file-input {
    display: none;
}

.upload-label {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 4rem;
    background: rgba(255, 255, 255, 0.15);
    border: 2px dashed rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-label:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
}

.upload-icon {
    font-size: 3rem;
}

.upload-label span {
    font-size: 1.1rem;
    font-weight: 500;
}

.upload-label small {
    font-size: 0.9rem;
    opacity: 0.8;
}

.cover-preview {
    position: relative;
    width: 250px;
    margin: 0 auto;
}

.cover-preview img {
    width: 100%;
    height: auto;
    max-height: 350px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.remove-cover-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e74c3c;
    color: white;
    border: 2px solid white;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.remove-cover-btn:hover {
    background: #c0392b;
    transform: scale(1.1);
}

/* Form Groups */
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

.form-group input[type="text"],
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
    min-height: 100px;
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
}

/* Form Actions */
.form-actions {
    margin-top: 1rem;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: #95a5a6;
    color: white;
}

.btn-cancel:hover {
    background: #7f8c8d;
}

.btn-submit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
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
@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }

    .form-card {
        padding: 1.5rem;
    }

    .upload-label {
        padding: 2rem 2rem;
    }
}
</style>