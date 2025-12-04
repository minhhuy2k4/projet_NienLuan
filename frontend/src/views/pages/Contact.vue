<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
        <div class="max-w-5xl mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-12 animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-800 mb-3">
                    <span class="text-5xl">📧</span>
                    Liên Hệ Với Chúng Tôi
                </h1>
                <p class="text-gray-600 text-lg">
                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <!-- Contact Form -->
                <div class="bg-white rounded-2xl shadow-xl p-8 animate-slide-up border border-gray-100">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>✉️</span>
                        Gửi Tin Nhắn
                    </h2>

                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" type="text" required placeholder="Nguyễn Văn A"
                                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors">
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Email <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.email" type="email" required placeholder="email@example.com"
                                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors">
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            <input v-model="form.phone" type="tel" placeholder="0123 456 789"
                                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors">
                        </div>

                        <!-- Subject -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Chủ đề <span class="text-red-500">*</span>
                            </label>
                            <select v-model="form.subject" required
                                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors">
                                <option value="">-- Chọn chủ đề --</option>
                                <option value="support">Hỗ trợ kỹ thuật</option>
                                <option value="feedback">Góp ý / Phản hồi</option>
                                <option value="partnership">Hợp tác</option>
                                <option value="bug">Báo lỗi</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <!-- Message -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Nội dung <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.message" required rows="5"
                                placeholder="Nhập nội dung tin nhắn của bạn..."
                                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none"></textarea>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" :disabled="submitting"
                            class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                            <span v-if="!submitting">Gửi tin nhắn 🚀</span>
                            <span v-else>Đang gửi...</span>
                        </button>
                    </form>

                    <!-- Success Message -->
                    <div v-if="showSuccess"
                        class="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg animate-fade-in">
                        ✅ Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24h.
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="space-y-6">
                    <!-- Contact Cards -->
                    <div class="bg-white rounded-2xl shadow-xl p-6 animate-slide-up border border-gray-100"
                        style="animation-delay: 100ms">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>📍</span>
                            Thông Tin Liên Hệ
                        </h3>

                        <div class="space-y-4">
                            <!-- Email -->
                            <div
                                class="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <span class="text-3xl">✉️</span>
                                <div>
                                    <div class="font-semibold text-gray-800">Email</div>
                                    <a href="mailto:support@audiotruyen.vn" class="text-purple-600 hover:underline">
                                        support@audiotruyen.vn
                                    </a>
                                </div>
                            </div>

                            <!-- Phone -->
                            <div
                                class="flex items-start gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                                <span class="text-3xl">📞</span>
                                <div>
                                    <div class="font-semibold text-gray-800">Điện thoại</div>
                                    <a href="tel:0123456789" class="text-pink-600 hover:underline">
                                        0123 456 789
                                    </a>
                                </div>
                            </div>

                            <!-- Address -->
                            <div
                                class="flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <span class="text-3xl">🏢</span>
                                <div>
                                    <div class="font-semibold text-gray-800">Địa chỉ</div>
                                    <p class="text-gray-700">
                                        123 Đường ABC, Quận 1<br>
                                        TP. Hồ Chí Minh, Việt Nam
                                    </p>
                                </div>
                            </div>

                            <!-- Working Hours -->
                            <div
                                class="flex items-start gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <span class="text-3xl">🕐</span>
                                <div>
                                    <div class="font-semibold text-gray-800">Giờ làm việc</div>
                                    <p class="text-gray-700">
                                        Thứ 2 - Thứ 6: 8:00 - 18:00<br>
                                        Thứ 7 - Chủ nhật: 9:00 - 17:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <div class="bg-white rounded-2xl shadow-xl p-6 animate-slide-up border border-gray-100"
                        style="animation-delay: 200ms">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>🌐</span>
                            Mạng Xã Hội
                        </h3>
                        <div class="grid grid-cols-2 gap-3">
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105">
                                <span class="text-2xl">📘</span>
                                <span class="font-semibold text-gray-800">Facebook</span>
                            </a>
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all transform hover:scale-105">
                                <span class="text-2xl">📹</span>
                                <span class="font-semibold text-gray-800">YouTube</span>
                            </a>
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all transform hover:scale-105">
                                <span class="text-2xl">📷</span>
                                <span class="font-semibold text-gray-800">Instagram</span>
                            </a>
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105">
                                <span class="text-2xl">🐦</span>
                                <span class="font-semibold text-gray-800">Twitter</span>
                            </a>
                        </div>
                    </div>

                    <!-- FAQ Link -->
                    <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white animate-slide-up"
                        style="animation-delay: 300ms">
                        <h3 class="text-xl font-bold mb-3">Có câu hỏi nhanh?</h3>
                        <p class="text-purple-100 mb-4">Xem danh sách câu hỏi thường gặp để tìm câu trả lời nhanh chóng
                        </p>
                        <router-link to="/faq"
                            class="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all transform hover:scale-105">
                            Xem FAQ →
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
});

const submitting = ref(false);
const showSuccess = ref(false);

const handleSubmit = async () => {
    submitting.value = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Form submitted:', form.value);

    // Show success message
    showSuccess.value = true;
    submitting.value = false;

    // Reset form
    form.value = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    };

    // Hide success message after 5 seconds
    setTimeout(() => {
        showSuccess.value = false;
    }, 5000);
};
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
    animation: slide-up 0.8s ease-out;
}
</style>
