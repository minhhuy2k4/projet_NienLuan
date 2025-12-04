<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
        <div class="max-w-5xl mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-12 animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-800 mb-3">
                    <svg class="w-16 h-16 inline-block text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <br />Liên Hệ Với Chúng Tôi
                </h1>
                <p class="text-gray-600 text-lg">
                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <!-- Contact Form -->
                <div class="bg-white rounded-2xl shadow-xl p-8 animate-slide-up border border-gray-100">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
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
                            <span v-if="!submitting" class="flex items-center justify-center gap-2">
                                Gửi tin nhắn
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </span>
                            <span v-else>Đang gửi...</span>
                        </button>
                    </form>

                    <!-- Success Message -->
                    <div v-if="showSuccess"
                        class="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg animate-fade-in flex items-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24h.
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="space-y-6">
                    <!-- Contact Cards -->
                    <div class="bg-white rounded-2xl shadow-xl p-6 animate-slide-up border border-gray-100"
                        style="animation-delay: 100ms">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clip-rule="evenodd" />
                            </svg>
                            Thông Tin Liên Hệ
                        </h3>

                        <div class="space-y-4">
                            <!-- Email -->
                            <div
                                class="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
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
                                <svg class="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
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
                                <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                        clip-rule="evenodd" />
                                </svg>
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
                                <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clip-rule="evenodd" />
                                </svg>
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
                            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                                    clip-rule="evenodd" />
                            </svg>
                            Mạng Xã Hội
                        </h3>
                        <div class="grid grid-cols-2 gap-3">
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105">
                                <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span class="font-semibold text-gray-800">Facebook</span>
                            </a>
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all transform hover:scale-105">
                                <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span class="font-semibold text-gray-800">YouTube</span>
                            </a>
                            <a href="#"
                                class="flex items-center gap-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all transform hover:scale-105">
                                <svg class="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                </svg>
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
