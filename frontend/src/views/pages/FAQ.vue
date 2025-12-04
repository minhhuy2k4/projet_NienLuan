<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-12 animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-800 mb-3">
                    <span class="text-5xl">❓</span>
                    Câu Hỏi Thường Gặp
                </h1>
                <p class="text-gray-600 text-lg">
                    Tìm câu trả lời cho những thắc mắc thường gặp của bạn
                </p>
            </div>

            <!-- Search Box -->
            <div class="mb-8 animate-slide-up">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm câu hỏi..."
                        class="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-sm">
                    <span class="absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
                </div>
            </div>

            <!-- FAQ Categories -->
            <div class="mb-8 flex flex-wrap gap-3 justify-center animate-slide-up">
                <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
                    'px-5 py-2 rounded-full font-semibold transition-all',
                    selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                ]">
                    {{ cat }}
                </button>
            </div>

            <!-- FAQ List -->
            <div class="space-y-4">
                <div v-for="(faq, index) in filteredFaqs" :key="index"
                    class="bg-white rounded-xl shadow-md overflow-hidden animate-slide-up border border-gray-100 hover:shadow-lg transition-shadow"
                    :style="{ animationDelay: `${index * 100}ms` }">
                    <button @click="toggleFaq(index)"
                        class="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span class="font-semibold text-gray-800 text-lg pr-4">
                            {{ faq.question }}
                        </span>
                        <span class="text-2xl transform transition-transform"
                            :class="{ 'rotate-180': openFaqIndex === index }">
                            ▼
                        </span>
                    </button>

                    <div v-show="openFaqIndex === index"
                        class="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4 animate-fade-in">
                        {{ faq.answer }}
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-if="filteredFaqs.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">🤔</div>
                <p class="text-gray-600 text-lg">Không tìm thấy câu hỏi phù hợp</p>
            </div>

            <!-- Contact Section -->
            <div
                class="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-xl animate-slide-up">
                <h3 class="text-2xl font-bold mb-3">Không tìm thấy câu trả lời?</h3>
                <p class="mb-6 text-blue-100">Đừng lo lắng! Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                <router-link to="/contact"
                    class="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                    Liên hệ với chúng tôi →
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCategory = ref('Tất cả');
const openFaqIndex = ref(null);

const categories = ['Tất cả', 'Tài khoản', 'Truyện', 'Thanh toán', 'Kỹ thuật'];

const faqs = [
    {
        category: 'Tài khoản',
        question: 'Làm thế nào để đăng ký tài khoản?',
        answer: 'Bạn có thể đăng ký tài khoản bằng cách nhấn vào nút "Đăng ký" ở góc trên cùng bên phải, sau đó điền thông tin email, tên và mật khẩu. Hoặc bạn có thể đăng nhập nhanh bằng tài khoản Google.'
    },
    {
        category: 'Tài khoản',
        question: 'Tôi quên mật khẩu, phải làm sao?',
        answer: 'Nhấn vào "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn trong vòng vài phút.'
    },
    {
        category: 'Tài khoản',
        question: 'Tôi có thể thay đổi thông tin cá nhân không?',
        answer: 'Có, bạn có thể cập nhật thông tin cá nhân bằng cách vào "Trang cá nhân" từ menu người dùng. Tại đây bạn có thể thay đổi tên, avatar và mật khẩu.'
    },
    {
        category: 'Truyện',
        question: 'Làm sao để tìm truyện yêu thích?',
        answer: 'Bạn có thể sử dụng thanh tìm kiếm ở trên cùng, hoặc duyệt theo thể loại, xem truyện mới, truyện hot, truyện hoàn thành. Mỗi truyện đều có thông tin chi tiết về tác giả, thể loại và số chương.'
    },
    {
        category: 'Truyện',
        question: 'Có thể tải truyện về nghe offline không?',
        answer: 'Hiện tại chúng tôi chưa hỗ trợ tính năng tải truyện offline. Bạn cần kết nối internet để nghe truyện. Tính năng này đang được phát triển và sẽ sớm ra mắt.'
    },
    {
        category: 'Truyện',
        question: 'Làm thế nào để đánh dấu truyện yêu thích?',
        answer: 'Khi xem chi tiết truyện, nhấn vào nút trái tim (❤️) để thêm vào danh sách yêu thích. Bạn có thể xem lại danh sách truyện yêu thích trong menu người dùng.'
    },
    {
        category: 'Truyện',
        question: 'Truyện được cập nhật bao lâu một lần?',
        answer: 'Tần suất cập nhật phụ thuộc vào từng truyện và tác giả. Bạn có thể theo dõi truyện yêu thích để nhận thông báo khi có chương mới.'
    },
    {
        category: 'Thanh toán',
        question: 'Các hình thức thanh toán nào được hỗ trợ?',
        answer: 'Chúng tôi chấp nhận thanh toán qua thẻ ATM nội địa, thẻ Visa/Mastercard, Momo, ZaloPay và chuyển khoản ngân hàng.'
    },
    {
        category: 'Thanh toán',
        question: 'Tôi có thể hoàn tiền không?',
        answer: 'Bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày mua nếu chưa sử dụng. Vui lòng liên hệ bộ phận hỗ trợ với thông tin đơn hàng để được xử lý.'
    },
    {
        category: 'Kỹ thuật',
        question: 'Tại sao truyện không phát được âm thanh?',
        answer: 'Kiểm tra kết nối internet, đảm bảo trình duyệt của bạn cho phép phát âm thanh. Thử tải lại trang hoặc xóa cache trình duyệt. Nếu vẫn không được, vui lòng liên hệ hỗ trợ.'
    },
    {
        category: 'Kỹ thuật',
        question: 'Trang web có ứng dụng mobile không?',
        answer: 'Hiện tại chúng tôi chưa có ứng dụng mobile riêng, nhưng website đã được tối ưu cho thiết bị di động. Bạn có thể truy cập qua trình duyệt trên điện thoại để có trải nghiệm tốt nhất.'
    },
    {
        category: 'Kỹ thuật',
        question: 'Làm sao để báo lỗi hoặc góp ý?',
        answer: 'Bạn có thể gửi báo cáo lỗi hoặc góp ý qua trang "Liên hệ" hoặc email trực tiếp đến support@audiotruyen.vn. Chúng tôi luôn lắng nghe và cải thiện dịch vụ.'
    }
];

const filteredFaqs = computed(() => {
    let result = faqs;

    // Filter by category
    if (selectedCategory.value !== 'Tất cả') {
        result = result.filter(faq => faq.category === selectedCategory.value);
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(faq =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
    }

    return result;
});

const toggleFaq = (index) => {
    openFaqIndex.value = openFaqIndex.value === index ? null : index;
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
