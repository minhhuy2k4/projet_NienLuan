<template>
    <div class="container mx-auto px-4 py-8 animate-fade-in">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 animate-slide-up">Quản lý Banner</h1>

        <!-- Add New Banner Button -->
        <div class="mb-6 animate-slide-up" style="animation-delay: 0.1s">
            <button @click="showAddForm = true"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-2">
                <span class="text-xl">➕</span>
                <span>Thêm Banner mới</span>
            </button>
        </div>

        <!-- Add/Edit Banner Form Modal -->
        <div v-if="showAddForm || editingBanner"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
                <h2 class="text-2xl font-bold mb-6">{{ editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới' }}</h2>

                <form @submit.prevent="saveBanner" class="space-y-4">
                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Tiêu đề *</label>
                        <input v-model="formData.title" type="text" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="VD: TRUYỆN HÀN QUỐC">
                    </div>

                    <!-- Subtitle -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Phụ đề *</label>
                        <input v-model="formData.subtitle" type="text" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="VD: Khám phá thế giới Manhwa đầy màu sắc">
                    </div>

                    <!-- Image URL -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Hình ảnh Banner *</label>

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
                                placeholder="https://... hoặc /banners/...">
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
                            <img :src="getBannerUrl(formData.image)" alt="Preview"
                                class="w-full h-48 object-cover rounded-lg" @error="handleImageError">
                        </div>

                        <!-- Upload Progress -->
                        <div v-if="uploading" class="mt-3">
                            <div class="flex items-center gap-2">
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span class="text-sm text-gray-600">Đang upload...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Order -->
                    <div>
                        <label class="block text-sm font-semibold mb-2">Thứ tự hiển thị</label>
                        <input v-model.number="formData.order" type="number" min="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0">
                        <small class="text-gray-500">Số thứ tự nhỏ hơn sẽ hiển thị trước</small>
                    </div>

                    <!-- Active Status -->
                    <div class="flex items-center gap-3">
                        <input v-model="formData.isActive" type="checkbox" id="isActive"
                            class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
                        <label for="isActive" class="font-semibold">Hiển thị banner này</label>
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-3 pt-4">
                        <button type="submit"
                            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                            {{ editingBanner ? 'Cập nhật' : 'Thêm Banner' }}
                        </button>
                        <button type="button" @click="cancelForm"
                            class="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Banners List -->
        <div v-if="banners.length > 0" class="space-y-4">
            <div v-for="(banner, index) in banners" :key="banner._id"
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition animate-slide-up"
                :style="{ animationDelay: `${index * 0.1}s` }">
                <div class="flex gap-6">
                    <!-- Banner Image -->
                    <div class="w-64 h-40 flex-shrink-0">
                        <img :src="getBannerUrl(banner.image)" :alt="banner.title"
                            class="w-full h-full object-cover rounded-lg" @error="handleImageError">
                    </div>

                    <!-- Banner Info -->
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">{{ banner.title }}</h3>
                                <p class="text-gray-600 mt-1">{{ banner.subtitle }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span v-if="banner.isActive"
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
                            <span>Thứ tự: {{ banner.order }}</span>
                            <span class="mx-2">•</span>
                            <span>Tạo: {{ formatDate(banner.createdAt) }}</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3">
                            <button @click="toggleActive(banner)"
                                :class="banner.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'"
                                class="px-4 py-2 text-white font-semibold rounded-lg transition">
                                {{ banner.isActive ? '👁️ Ẩn' : '👁️‍🗨️ Hiện' }}
                            </button>
                            <button @click="editBanner(banner)"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                                ✏️ Sửa
                            </button>
                            <button @click="deleteBanner(banner._id)"
                                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                                🗑️ Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

        <!-- Empty State -->
        <div v-else-if="banners.length === 0" class="text-center py-12 bg-gray-50 rounded-lg animate-slide-up">
            <span class="text-6xl mb-4 block">🎨</span>
            <p class="text-gray-600 text-lg">Chưa có banner nào</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BannerService from '@/services/banner.service';
import { getBannerUrl } from '@/utils/media';

const banners = ref([]);
const showAddForm = ref(false);
const editingBanner = ref(null);
const uploading = ref(false);
const uploadedFile = ref(null);
const fileInput = ref(null);

// Pagination state
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 5;

const formData = ref({
    title: '',
    subtitle: '',
    image: '',
    order: 0,
    isActive: true
});

// Handle image error
const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
};

// Handle file upload
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        uploading.value = true;
        const response = await BannerService.uploadImage(file);
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

// Load banners from API
const loadBanners = async () => {
    try {
        const response = await BannerService.getAll(currentPage.value, itemsPerPage);
        banners.value = response.data?.banners || [];
        totalPages.value = response.data?.pagination?.totalPages || 1;
    } catch (error) {
        console.error('Load banners error:', error);
        alert('❌ Không thể tải danh sách banner!');
    }
};

// Save banner
const saveBanner = async () => {
    try {
        if (editingBanner.value) {
            // Update existing
            await BannerService.update(editingBanner.value._id, formData.value);
            alert('✅ Đã cập nhật banner thành công!');
        } else {
            // Add new
            await BannerService.create(formData.value);
            alert('✅ Đã thêm banner thành công!');
            currentPage.value = 1; // Go to first page after adding
        }

        await loadBanners();
        cancelForm();
    } catch (error) {
        console.error('Save banner error:', error);
        alert('❌ Có lỗi xảy ra khi lưu banner!');
    }
};

// Edit banner
const editBanner = (banner) => {
    editingBanner.value = banner;
    formData.value = {
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        order: banner.order,
        isActive: banner.isActive
    };
    // Set uploaded file if image is not a URL
    if (banner.image && !banner.image.startsWith('http')) {
        uploadedFile.value = banner.image.split('/').pop();
    }
};

// Cancel form
const cancelForm = () => {
    showAddForm.value = false;
    editingBanner.value = null;
    uploadedFile.value = null;
    formData.value = {
        title: '',
        subtitle: '',
        image: '',
        order: 0,
        isActive: true
    };
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Toggle active status
const toggleActive = async (banner) => {
    try {
        await BannerService.toggleActive(banner._id);
        await loadBanners();
    } catch (error) {
        console.error('Toggle active error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
};

// Delete banner
const deleteBanner = async (id) => {
    if (!confirm('🗑️ Bạn có chắc muốn xóa banner này?')) return;

    try {
        await BannerService.delete(id);
        alert('✅ Đã xóa banner!');
        await loadBanners();
    } catch (error) {
        console.error('Delete banner error:', error);
        alert('❌ Có lỗi xảy ra khi xóa banner!');
    }
};

// Pagination
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        loadBanners();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        loadBanners();
    }
};

onMounted(() => {
    loadBanners();
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
