<template>
    <div class="container mx-auto px-4 py-8 animate-fade-in">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 animate-slide-up">Quản lý Quảng cáo</h1>

        <!-- Search and Add Button -->
        <div class="mb-6 animate-slide-up flex gap-4 items-center" style="animation-delay: 0.1s">
            <div class="flex-1">
                <input v-model="searchQuery" @input="handleSearch" type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="🔍 Tìm kiếm quảng cáo theo tiêu đề hoặc mô tả...">
            </div>
            <button @click="showAddForm = true"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-2">
                <span class="text-xl">➕</span>
                <span>Thêm quảng cáo mới</span>
            </button>
        </div>

        <!-- Add/Edit Ad Form Modal -->
        <div v-if="showAddForm || editingAd"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
                <h2 class="text-2xl font-bold mb-6">{{ editingAd ? 'Chỉnh sửa quảng cáo' : 'Thêm quảng cáo mới' }}</h2>

                <form @submit.prevent="saveAd" class="space-y-4">
                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Tiêu đề *</label>
                        <input v-model="formData.title" type="text" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tiêu đề quảng cáo">
                    </div>

                    <!-- Chọn vị trí hiển thị quảng cáo -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Vị trí hiển thị *</label>
                        <select v-model="formData.position" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="home">Trang chủ</option>
                            <option value="story-detail">Chi tiết truyện</option>
                            <option value="chapter-detail">Chi tiết chương</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Mô tả</label>
                        <textarea v-model="formData.description" rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mô tả quảng cáo"></textarea>
                    </div>

                    <!-- Image URL -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Hình ảnh *</label>

                        <!-- Upload File -->
                        <div class="mb-3">
                            <input type="file" @change="handleFileUpload" accept="image/*" ref="fileInput"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <small class="text-gray-500">Upload ảnh từ máy tính hoặc nhập URL bên dưới</small>
                        </div>

                        <!-- URL Input - Only show if no file uploaded -->
                        <div v-if="!uploadedFile">
                            <label class="block text-sm text-gray-600 mb-2">Hoặc nhập URL</label>
                            <input v-model="formData.image" type="url" :required="!uploadedFile"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="https://... hoặc /ads/...">
                        </div>

                        <!-- Show uploaded file info -->
                        <div v-if="uploadedFile" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-green-600">✓</span>
                                    <span class="text-sm text-green-800">{{ uploadedFile }}</span>
                                </div>
                                <button type="button" @click="clearUploadedFile"
                                    class="text-red-600 hover:text-red-800 text-sm font-semibold">
                                    Xóa
                                </button>
                            </div>
                        </div>

                        <!-- Preview -->
                        <div v-if="formData.image" class="mt-3">
                            <img :src="getAdUrl(formData.image)" alt="Preview"
                                class="w-full h-48 object-cover rounded-lg">
                        </div>

                        <!-- Upload Progress -->
                        <div v-if="uploading" class="mt-3">
                            <div class="flex items-center gap-2">
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span class="text-sm text-gray-600">Đang upload...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Link -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Link chuyển hướng *</label>
                        <input v-model="formData.link" type="url" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com">
                    </div>

                    <!-- Order -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Thứ tự hiển thị</label>
                        <input v-model.number="formData.order" type="number" min="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0">
                        <small class="text-gray-500">Số thứ tự nhỏ hơn sẽ hiển thị trước</small>
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-3 pt-4">
                        <button type="submit"
                            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                            {{ editingAd ? 'Cập nhật' : 'Thêm quảng cáo' }}
                        </button>
                        <button type="button" @click="cancelForm"
                            class="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Ads List -->
        <div v-if="ads.length > 0" class="space-y-4">
            <div v-for="(ad, index) in ads" :key="ad._id"
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition animate-slide-up"
                :style="{ animationDelay: `${index * 0.1}s` }">
                <div class="flex gap-6">
                    <!-- Ad Image -->
                    <div class="w-64 h-40 flex-shrink-0">
                        <img :src="getAdUrl(ad.image)" :alt="ad.title" class="w-full h-full object-cover rounded-lg">
                    </div>

                    <!-- Ad Info -->
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">{{ ad.title }}</h3>
                                <p class="text-gray-600 mt-1" v-if="ad.description">{{ ad.description }}</p>
                                <p class="text-sm text-blue-600 mt-1">
                                    <a :href="ad.link" target="_blank" class="hover:underline">{{ ad.link }}</a>
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span v-if="ad.isActive"
                                    class="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                    Đang hiển thị
                                </span>
                                <span v-else
                                    class="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">
                                    Đã ẩn
                                </span>
                            </div>
                        </div>

                        <div class="text-sm text-gray-500 mb-4">
                            <span>Vị trí: <strong>{{ getPositionLabel(ad.position) }}</strong></span>
                            <span class="mx-2">•</span>
                            <span>Thứ tự: {{ ad.order }}</span>
                            <span class="mx-2">•</span>
                            <span>👁️ {{ ad.viewCount || 0 }} lượt xem</span>
                            <span class="mx-2">•</span>
                            <span>🖱️ {{ ad.clickCount || 0 }} clicks</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3">
                            <button @click="toggleActive(ad)"
                                :class="ad.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'"
                                class="px-4 py-2 text-white font-semibold rounded-lg transition">
                                {{ ad.isActive ? '👁️ Ẩn' : '👁️‍🗨️ Hiện' }}
                            </button>
                            <button @click="editAd(ad)"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                                ✏️ Sửa
                            </button>
                            <button @click="deleteAd(ad._id)"
                                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                                🗑️ Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                ← Trước
            </button>
            <div class="px-6 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
                Trang {{ currentPage }} / {{ totalPages }}
            </div>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                Sau →
            </button>
        </div>

        <!-- Displaying info -->
        <div v-if="ads.length > 0" class="mt-4 text-center text-sm text-gray-600">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, ads.length) }}
            / Tổng {{ ads.length }} quảng cáo
        </div>

        <!-- Empty State -->
        <div v-else-if="ads.length === 0" class="text-center py-12 bg-gray-50 rounded-lg animate-slide-up">
            <span class="text-6xl mb-4 block">📢</span>
            <p class="text-gray-600 text-lg">Chưa có quảng cáo nào</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdService from '@/services/ad.service';
import { getAdUrl } from '@/utils/media';

const ads = ref([]);
const showAddForm = ref(false);
const editingAd = ref(null);
const uploading = ref(false);
const uploadedFile = ref(null);
const fileInput = ref(null);
const searchQuery = ref('');

// Pagination state
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 5;

const formData = ref({
    title: '',
    description: '',
    image: '',
    link: '',
    position: 'home',
    order: 0
});

// Get position label
const getPositionLabel = (position) => {
    const labels = {
        'home': 'Trang chủ',
        'story-detail': 'Chi tiết truyện',
        'chapter-detail': 'Chi tiết chương'
    };
    return labels[position] || position;
};

// Handle file upload
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        uploading.value = true;
        const response = await AdService.uploadImage(file);
        formData.value.image = response.data.imageUrl;
        uploadedFile.value = file.name;
        alert('✅ Upload ảnh thành công!');
    } catch (error) {
        console.error('Upload error:', error);
        alert('❌ Lỗi khi upload ảnh!');
    } finally {
        uploading.value = false;
    }
};

// Clear uploaded file
const clearUploadedFile = () => {
    uploadedFile.value = null;
    formData.value.image = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Load ads from API
const loadAds = async () => {
    try {
        const response = await AdService.getAll(currentPage.value, itemsPerPage, searchQuery.value);
        ads.value = response.data?.ads || [];
        totalPages.value = response.data?.pagination?.totalPages || 1;
    } catch (error) {
        console.error('Load ads error:', error);
        alert('❌ Không thể tải danh sách quảng cáo!');
    }
};

// Handle search
const handleSearch = () => {
    currentPage.value = 1;
    loadAds();
};

// Save ad
const saveAd = async () => {
    try {
        if (editingAd.value) {
            // Update existing
            await AdService.update(editingAd.value._id, formData.value);
            alert('✅ Đã cập nhật quảng cáo thành công!');
        } else {
            // Add new
            await AdService.create(formData.value);
            alert('✅ Đã thêm quảng cáo thành công!');
            currentPage.value = 1; // Go to first page after adding
        }

        await loadAds();
        cancelForm();
    } catch (error) {
        console.error('Save ad error:', error);
        alert('❌ Có lỗi xảy ra khi lưu quảng cáo!');
    }
};

// Edit ad
const editAd = (ad) => {
    editingAd.value = ad;
    formData.value = {
        title: ad.title,
        description: ad.description || '',
        image: ad.image,
        link: ad.link,
        position: ad.position,
        order: ad.order || 0
    };
    // Set uploaded file if image is not a URL
    if (ad.image && !ad.image.startsWith('http')) {
        uploadedFile.value = ad.image.split('/').pop();
    }
};

// Cancel form
const cancelForm = () => {
    showAddForm.value = false;
    editingAd.value = null;
    uploadedFile.value = null;
    formData.value = {
        title: '',
        description: '',
        image: '',
        link: '',
        position: 'home',
        order: 0
    };
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Toggle active status
const toggleActive = async (ad) => {
    try {
        await AdService.toggleActive(ad._id);
        await loadAds();
    } catch (error) {
        console.error('Toggle active error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Delete ad
const deleteAd = async (id) => {
    if (!confirm('🗑️ Bạn có chắc muốn xóa quảng cáo này?')) return;

    try {
        await AdService.delete(id);
        alert('✅ Đã xóa quảng cáo!');
        await loadAds();
    } catch (error) {
        console.error('Delete ad error:', error);
        alert('❌ Có lỗi xảy ra khi xóa quảng cáo!');
    }
};

// Pagination
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        loadAds();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        loadAds();
    }
};

onMounted(() => {
    loadAds();
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-in;
}

.animate-slide-up {
    animation: slideUp 0.5s ease-out;
    animation-fill-mode: both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
