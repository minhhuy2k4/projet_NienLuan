<template>
    <main class="main-content">
        <header class="content-header animate-fade-in">
            <h2>Quản lý Thông tin Website cho Chatbot</h2>
            <p class="text-gray-600 mt-2">Cung cấp thông tin cho chatbot để trả lời câu hỏi về trang web</p>
        </header>

        <div class="main-data-grid">
            <div class="data-card animate-slide-up">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Tên trang web -->
                    <div class="form-group">
                        <label for="siteName" class="form-label">
                            <span class="font-semibold">Tên trang web</span>
                            <span class="text-sm text-gray-500 ml-2">(Ví dụ: Truyện Audio Online)</span>
                        </label>
                        <input type="text" id="siteName" v-model="formData.siteName"
                            class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên trang web">
                    </div>

                    <!-- Mô tả trang web -->
                    <div class="form-group">
                        <label for="description" class="form-label">
                            <span class="font-semibold">Mô tả trang web</span>
                            <span class="text-sm text-gray-500 ml-2">(Giới thiệu chung về trang web)</span>
                        </label>
                        <textarea id="description" v-model="formData.description" rows="4"
                            class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ví dụ: Trang web cung cấp truyện audio với nhiều thể loại đa dạng..."></textarea>
                    </div>

                    <!-- Tính năng chính -->
                    <div class="form-group">
                        <label for="features" class="form-label">
                            <span class="font-semibold">Tính năng chính</span>
                            <span class="text-sm text-gray-500 ml-2">(Các tính năng nổi bật)</span>
                        </label>
                        <textarea id="features" v-model="formData.features" rows="6"
                            class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ví dụ:&#10;- Nghe truyện audio trực tuyến&#10;- Đánh giá và bình luận&#10;- Lưu truyện yêu thích&#10;- Theo dõi lịch sử nghe"></textarea>
                    </div>

                    <!-- Thông tin liên hệ -->
                    <div class="form-group">
                        <label for="contact" class="form-label">
                            <span class="font-semibold">Thông tin liên hệ</span>
                            <span class="text-sm text-gray-500 ml-2">(Email, số điện thoại, địa chỉ...)</span>
                        </label>
                        <textarea id="contact" v-model="formData.contact" rows="4"
                            class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ví dụ:&#10;Email: support@example.com&#10;Hotline: 1900 xxxx&#10;Địa chỉ: ..."></textarea>
                    </div>

                    <!-- Chính sách & Quy định -->
                    <div class="form-group">
                        <label for="policies" class="form-label">
                            <span class="font-semibold">Chính sách & Quy định</span>
                            <span class="text-sm text-gray-500 ml-2">(Điều khoản sử dụng, bảo mật...)</span>
                        </label>
                        <textarea id="policies" v-model="formData.policies" rows="6"
                            class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ví dụ:&#10;- Người dùng cần đăng ký tài khoản để sử dụng đầy đủ tính năng&#10;- Nghiêm cấm chia sẻ nội dung bản quyền&#10;- ..."></textarea>
                    </div>

                    <!-- Thông tin thêm -->
                    <div class="form-group">
                        <label for="additionalInfo" class="form-label">
                            <span class="font-semibold">Thông tin thêm</span>
                            <span class="text-sm text-gray-500 ml-2">(Các thông tin khác cần thiết)</span>
                        </label>
                        <textarea id="additionalInfo" v-model="formData.additionalInfo" rows="4"
                            class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Thông tin bổ sung khác..."></textarea>
                    </div>

                    <!-- Error message -->
                    <p v-if="error" class="error-message text-red-500 text-sm">{{ error }}</p>

                    <!-- Success message -->
                    <p v-if="success" class="success-message text-green-500 text-sm">{{ success }}</p>

                    <!-- Submit button -->
                    <div class="button-group flex gap-4">
                        <button type="submit"
                            class="px-6 py-3 !bg-green-600 hover:!bg-green-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="loading">
                            <span v-if="loading" class="flex items-center gap-2">
                                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Đang lưu...
                            </span>
                            <span v-else>Lưu thông tin</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Preview card -->
            <div class="data-card animate-slide-up" style="animation-delay: 100ms;">
                <h3 class="text-xl font-bold mb-4">📝 Hướng dẫn</h3>
                <div class="space-y-4 text-sm text-gray-600">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="font-semibold text-blue-900 mb-2">💡 Mục đích</p>
                        <p>Thông tin này sẽ được chatbot sử dụng để trả lời các câu hỏi của người dùng về trang web,
                            tính năng, chính sách và cách sử dụng.</p>
                    </div>

                    <div class="bg-green-50 p-4 rounded-lg">
                        <p class="font-semibold text-green-900 mb-2">✅ Nên cung cấp</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Thông tin chính xác và cập nhật</li>
                            <li>Mô tả rõ ràng, dễ hiểu</li>
                            <li>Danh sách tính năng đầy đủ</li>
                            <li>Thông tin liên hệ chính thức</li>
                        </ul>
                    </div>

                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <p class="font-semibold text-yellow-900 mb-2">⚠️ Lưu ý</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Dữ liệu về truyện, tác giả, thể loại được tự động đồng bộ</li>
                            <li>Chỉ cần cập nhật thông tin chung về trang web</li>
                            <li>Sau khi lưu, chatbot sẽ sử dụng thông tin mới ngay lập tức</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WebsiteInfoService from '@/services/websiteinfo.service';

const formData = ref({
    siteName: '',
    description: '',
    features: '',
    contact: '',
    policies: '',
    additionalInfo: ''
});

const loading = ref(false);
const error = ref(null);
const success = ref(null);

// Load current website info
const loadWebsiteInfo = async () => {
    try {
        loading.value = true;
        const data = await WebsiteInfoService.get();
        formData.value = data;
    } catch (err) {
        console.error('Error loading website info:', err);
        error.value = 'Không thể tải thông tin website';
    } finally {
        loading.value = false;
    }
};

// Handle form submit
const handleSubmit = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
        await WebsiteInfoService.update(formData.value);
        success.value = '✅ Đã lưu thông tin thành công! Chatbot sẽ sử dụng thông tin mới.';

        // Clear success message after 3 seconds
        setTimeout(() => {
            success.value = null;
        }, 3000);
    } catch (err) {
        console.error('Error saving website info:', err);
        if (err.response) {
            error.value = err.response.data?.message || `Lỗi ${err.response.status}: ${err.response.statusText}`;
        } else if (err.request) {
            error.value = 'Không thể kết nối đến server';
        } else {
            error.value = err.message || 'Lỗi khi lưu thông tin';
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadWebsiteInfo();
});
</script>

<style scoped>
.main-content {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.content-header {
    margin-bottom: 2rem;
}

.content-header h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
}

.main-data-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

@media (max-width: 1024px) {
    .main-data-grid {
        grid-template-columns: 1fr;
    }
}

.data-card {
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
}

.form-input {
    font-family: inherit;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-in;
}

.animate-slide-up {
    animation: slideUp 0.5s ease-out;
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
