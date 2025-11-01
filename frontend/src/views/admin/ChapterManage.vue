<template>
    <div class="main-content">
        <div class="content-header animate-fade-in">
            <h2>Quản lý Chương</h2>
            <router-link :to="{ name: 'admin.story.list' }" class="btn-back transform hover:scale-105 transition">Quay
                lại</router-link>
        </div>

        <div v-if="story" class="story-info-card animate-slide-up">
            <div class="story-cover">
                <img v-if="story.image" :src="story.image" :alt="story.name" class="animate-fade-in">
                <div v-else class="no-cover"></div>
            </div>
            <div class="story-details">
                <h3>{{ story.name }}</h3>
                <p class="description">{{ story.description }}</p>
                <div class="stats-row">
                    <span class="stat"><strong>{{ chapters.length }}</strong> chương</span>
                    <span class="stat"><strong>{{ story.totalViews || 0 }}</strong> lượt xem</span>
                </div>
            </div>
        </div>

        <div class="add-chapter-card animate-slide-up animation-delay-100">
            <h3>{{ editingChapter ? 'Sửa Chương' : 'Thêm Chương Mới' }}</h3>
            <form @submit.prevent="saveChapter" class="chapter-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Số chương (để trống sẽ tự động tăng)</label>
                        <input type="number" v-model.number="chapterForm.chapterNumber" min="1"
                            class="focus:ring-2 focus:ring-blue-500 transition" placeholder="Tự động">
                    </div>
                    <div class="form-group">
                        <label>Tiêu đề chương</label>
                        <input type="text" v-model="chapterForm.title" required
                            class="focus:ring-2 focus:ring-blue-500 transition">
                    </div>
                </div>
                <div class="form-group">
                    <label>Nội dung</label>
                    <textarea v-model="chapterForm.content" rows="4"
                        class="focus:ring-2 focus:ring-blue-500 transition"></textarea>
                </div>
                <div class="form-group">
                    <label>File Audio (MP3)</label>
                    <input type="file" @change="handleAudioSelect" accept="audio/*" ref="audioInput">
                    <p v-if="selectedAudio" class="file-info animate-fade-in">{{ selectedAudio.name }} ({{
                        formatFileSize(selectedAudio.size) }})</p>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-submit transform hover:scale-105 transition" :disabled="loading">
                        {{ loading ? 'Đang lưu...' : (editingChapter ? 'Cập nhật' : 'Tạo chương') }}
                    </button>
                    <button v-if="editingChapter" type="button" @click="cancelEdit"
                        class="btn-cancel transform hover:scale-105 transition">Hủy</button>
                </div>
            </form>
        </div>

        <div class="chapters-card">
            <div class="card-header">
                <h3>Danh sách Chương</h3>
                <span class="chapter-count">{{ chapters.length }} chương</span>
            </div>

            <div v-if="loading && chapters.length === 0" class="loading-state">
                <div class="spinner"></div>
                <p>Đang tải...</p>
            </div>

            <div v-else-if="chapters.length === 0" class="empty-state">
                <div class="empty-icon"></div>
                <h4>Chưa có chương nào</h4>
                <p>Hãy thêm chương đầu tiên!</p>
            </div>

            <div v-else class="chapters-grid">
                <div v-for="(chapter, index) in paginatedChapters" :key="chapter._id"
                    class="chapter-card animate-chapter-in hover:shadow-xl transition-all duration-300"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <div class="chapter-header-row">
                        <div class="chapter-badge">Chương {{ chapter.chapterNumber }}</div>
                        <div class="chapter-stats">
                            <span class="views">{{ chapter.views || 0 }} lượt xem</span>
                            <span v-if="chapter.audioUrl" class="has-audio">Có audio</span>
                        </div>
                    </div>
                    <h4 class="chapter-title">{{ chapter.title }}</h4>
                    <p v-if="chapter.content" class="chapter-content">{{ chapter.content.substring(0, 150) }}...</p>
                    <div v-if="chapter.audioUrl" class="audio-preview">
                        <audio controls :src="chapter.audioUrl" class="audio-player"></audio>
                    </div>
                    <div class="chapter-actions">
                        <button @click="editChapter(chapter)"
                            class="btn-edit transform hover:scale-105 transition">Sửa</button>
                        <button v-if="!chapter.audioUrl" @click="uploadAudioForChapter(chapter)"
                            class="btn-upload transform hover:scale-105 transition">Upload Audio</button>
                        <button @click="deleteChapter(chapter)"
                            class="btn-delete transform hover:scale-105 transition">Xóa</button>
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
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import storyService from '@/services/story.service';
import chapterService from '@/services/chapter.service';

const route = useRoute();
const storyId = route.params.storyId;

const story = ref(null);
const chapters = ref([]);
const loading = ref(false);
const editingChapter = ref(null);
const selectedAudio = ref(null);
const audioInput = ref(null);
const currentPage = ref(1);
const itemsPerPage = 5;

// Paginated chapters
const paginatedChapters = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return chapters.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
    return Math.ceil(chapters.value.length / itemsPerPage);
});

const chapterForm = ref({
    chapterNumber: null,
    title: '',
    content: '',
    storyId: storyId
});

const loadData = async () => {
    try {
        loading.value = true;
        const [storyData, chaptersData] = await Promise.all([
            storyService.get(storyId),
            chapterService.getByStory(storyId)
        ]);
        story.value = storyData;
        chapters.value = chaptersData;
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi tải dữ liệu');
    } finally {
        loading.value = false;
    }
};

const saveChapter = async () => {
    try {
        loading.value = true;
        let savedChapter;

        if (editingChapter.value) {
            // Không gửi storyId khi update vì không thể thay đổi
            const { storyId, ...updateData } = chapterForm.value;
            savedChapter = await chapterService.update(editingChapter.value._id, updateData);
            const index = chapters.value.findIndex(c => c._id === editingChapter.value._id);
            if (index !== -1) chapters.value[index] = savedChapter;
        } else {
            savedChapter = await chapterService.create(chapterForm.value);
            chapters.value.push(savedChapter);
        }

        // Upload audio nếu có
        if (selectedAudio.value && savedChapter) {
            await uploadAudio(savedChapter);
        }

        alert(editingChapter.value ? 'Cập nhật thành công!' : 'Tạo chương thành công!');
        cancelEdit();
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi lưu chương');
    } finally {
        loading.value = false;
    }
};

const editChapter = (chapter) => {
    editingChapter.value = chapter;
    chapterForm.value = {
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        content: chapter.content || '',
        storyId: typeof chapter.storyId === 'string' ? chapter.storyId : storyId
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
    editingChapter.value = null;
    selectedAudio.value = null;
    if (audioInput.value) audioInput.value.value = '';
    chapterForm.value = {
        chapterNumber: null,
        title: '',
        content: '',
        storyId: storyId
    };
};

const handleAudioSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedAudio.value = file;
    }
};

const uploadAudio = async (chapter) => {
    if (!selectedAudio.value || !chapter) return;

    try {
        const result = await chapterService.uploadAudio(
            storyId,
            chapter.chapterNumber,
            selectedAudio.value
        );

        // Cập nhật chapter với audioUrl mới
        const index = chapters.value.findIndex(c => c._id === chapter._id);
        if (index !== -1 && result.audioUrl) {
            chapters.value[index].audioUrl = result.audioUrl;
        }

        selectedAudio.value = null;
        if (audioInput.value) audioInput.value.value = '';
    } catch (error) {
        console.error('Error uploading audio:', error);
        alert('Lỗi khi upload audio');
    }
};

const uploadAudioForChapter = async (chapter) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            loading.value = true;

            const result = await chapterService.uploadAudio(
                storyId,
                chapter.chapterNumber,
                file
            );

            // Cập nhật chapter
            const index = chapters.value.findIndex(c => c._id === chapter._id);
            if (index !== -1 && result.audioUrl) {
                chapters.value[index].audioUrl = result.audioUrl;
            }

            alert('Upload audio thành công!');
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi upload audio');
        } finally {
            loading.value = false;
        }
    };
    input.click();
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const deleteChapter = async (chapter) => {
    if (!confirm('Xóa chương : ?')) return;
    try {
        await chapterService.delete(chapter._id);
        chapters.value = chapters.value.filter(c => c._id !== chapter._id);
        if (editingChapter.value && editingChapter.value._id === chapter._id) cancelEdit();
        alert('Xóa thành công!');
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi xóa chương');
    }
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.content-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.btn-back {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    text-decoration: none;
    color: #666;
}

.story-info-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 12px;
    color: white;
    margin-bottom: 2rem;
}

.story-cover img {
    width: 120px;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
}

.no-cover {
    width: 120px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-size: 2rem;
}

.stats-row {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
}

.stat strong {
    font-size: 1.5rem;
}

.add-chapter-card,
.chapters-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.chapter-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-grid {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.form-group input,
.form-group textarea {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
}

.form-group input[type="file"] {
    padding: 0.5rem;
    border: 2px dashed #ddd;
    background: #f8f9ff;
    cursor: pointer;
}

.file-info {
    margin-top: 0.5rem;
    color: #667eea;
    font-size: 0.9rem;
    font-weight: 500;
}

.form-actions {
    display: flex;
    gap: 1rem;
}

.btn-submit {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.btn-cancel {
    padding: 0.75rem 1.5rem;
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
}

.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.chapter-count {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-weight: 700;
}

.loading-state,
.empty-state {
    text-align: center;
    padding: 3rem;
}

.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border: 4px solid #f0f0f0;
    border-top: 4px solid var(--primary-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.chapters-grid {
    display: grid;
    gap: 1rem;
}

.chapter-card {
    background: #f8f9ff;
    border: 2px solid #e8ecff;
    border-radius: 12px;
    padding: 1.5rem;
}

.chapter-header-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.chapter-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
}

.chapter-stats {
    display: flex;
    gap: 1rem;
}

.chapter-title {
    margin: 0.5rem 0;
}

.chapter-content {
    color: #666;
    margin: 0.5rem 0;
}

.audio-preview {
    margin: 1rem 0;
}

.audio-player {
    width: 100%;
    height: 40px;
    border-radius: 8px;
}

.chapter-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

.btn-edit {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid var(--primary-blue);
    border-radius: 8px;
    color: var(--primary-blue);
    cursor: pointer;
}

.btn-upload {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid #4caf50;
    border-radius: 8px;
    color: #4caf50;
    cursor: pointer;
    font-weight: 600;
}

.btn-upload:hover {
    background: #4caf50;
    color: white;
}

.btn-delete {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid #ff5252;
    border-radius: 8px;
    color: #ff5252;
    cursor: pointer;
}

/* Pagination Styles */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.5rem;
}

.page-btn {
    padding: 0.5rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.page-btn:disabled {
    background: linear-gradient(135deg, #ccc 0%, #999 100%);
    cursor: not-allowed;
    opacity: 0.5;
}

.page-info {
    font-weight: 600;
    color: #333;
    min-width: 100px;
    text-align: center;
}
</style>
