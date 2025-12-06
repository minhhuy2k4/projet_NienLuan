<template>
    <div class="page-container">
        <div class="max-w-4xl mx-auto py-12 px-4">
            <div class="rounded-2xl shadow-xl p-8 animate-fade-in" style="background: var(--bg-card);">
                <h1 class="text-4xl font-bold mb-6" style="color: var(--text-primary);">Điều Khoản Sử Dụng</h1>
                <p class="text-sm mb-8" style="color: var(--text-secondary);">Cập nhật lần cuối: {{ lastUpdated }}</p>

                <div class="space-y-8">
                    <!-- Section 1 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">1. Chấp Nhận Điều Khoản
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Bằng việc truy cập và sử dụng trang web AudioTruyen, bạn đồng ý tuân thủ và bị ràng buộc bởi
                            các điều khoản và điều kiện sử dụng sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của
                            các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                        </p>
                    </section>

                    <!-- Section 2 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">2. Quyền Sử Dụng</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            AudioTruyen cấp cho bạn quyền truy cập và sử dụng dịch vụ cho mục đích cá nhân, phi thương
                            mại. Bạn không được:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Sao chép, phân phối hoặc công bố nội dung mà không có sự cho phép</li>
                            <li>Sử dụng dịch vụ cho mục đích thương mại trái phép</li>
                            <li>Tải lên nội dung vi phạm bản quyền hoặc pháp luật</li>
                            <li>Can thiệp hoặc làm gián đoạn hoạt động của hệ thống</li>
                            <li>Sử dụng bot, script hoặc công cụ tự động không được phép</li>
                        </ul>
                    </section>

                    <!-- Section 3 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">3. Tài Khoản Người Dùng
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Khi tạo tài khoản, bạn chịu trách nhiệm:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Cung cấp thông tin chính xác và cập nhật</li>
                            <li>Bảo mật thông tin đăng nhập của bạn</li>
                            <li>Chịu trách nhiệm về mọi hoạt động dưới tài khoản của bạn</li>
                            <li>Thông báo ngay lập tức nếu phát hiện truy cập trái phép</li>
                        </ul>
                    </section>

                    <!-- Section 4 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">4. Nội Dung Người Dùng
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Bạn giữ quyền sở hữu nội dung mà bạn tải lên, nhưng bằng việc đăng tải, bạn cấp cho
                            AudioTruyen quyền không độc quyền, miễn phí, toàn cầu để sử dụng, hiển thị và phân phối nội
                            dung đó trên nền tảng của chúng tôi.
                        </p>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Bạn cam kết rằng nội dung của bạn:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Không vi phạm bản quyền hoặc quyền sở hữu trí tuệ của bên thứ ba</li>
                            <li>Không chứa nội dung bất hợp pháp, khiêu dâm, bạo lực hoặc phân biệt đối xử</li>
                            <li>Không chứa virus, malware hoặc mã độc hại</li>
                            <li>Tuân thủ tất cả các luật và quy định hiện hành</li>
                        </ul>
                    </section>

                    <!-- Section 5 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">5. Bản Quyền và Sở Hữu
                            Trí Tuệ</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Tất cả nội dung, thiết kế, logo, và tài liệu khác trên AudioTruyen thuộc quyền sở hữu của
                            chúng tôi hoặc các bên cấp phép và được bảo vệ bởi luật bản quyền và sở hữu trí tuệ Việt Nam
                            và quốc tế.
                        </p>
                    </section>

                    <!-- Section 6 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">6. Giới Hạn Trách Nhiệm
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            AudioTruyen cung cấp dịch vụ "như hiện có" và không đảm bảo rằng dịch vụ sẽ không bị gián
                            đoạn, không có lỗi hoặc an toàn tuyệt đối. Chúng tôi không chịu trách nhiệm về:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Mất mát dữ liệu hoặc thiệt hại gián tiếp</li>
                            <li>Nội dung do người dùng khác cung cấp</li>
                            <li>Gián đoạn dịch vụ do bảo trì hoặc lỗi kỹ thuật</li>
                            <li>Hành vi của bên thứ ba trên nền tảng</li>
                        </ul>
                    </section>

                    <!-- Section 7 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">7. Chấm Dứt Dịch Vụ</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi có quyền tạm ngừng hoặc chấm dứt quyền truy cập của bạn vào dịch vụ mà không cần
                            thông báo trước nếu bạn vi phạm các điều khoản này hoặc có hành vi gây hại cho nền tảng hoặc
                            người dùng khác.
                        </p>
                    </section>

                    <!-- Section 8 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">8. Thay Đổi Điều Khoản
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            AudioTruyen có quyền cập nhật và sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ
                            có hiệu lực ngay khi được đăng tải trên trang web. Việc bạn tiếp tục sử dụng dịch vụ sau khi
                            có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
                        </p>
                    </section>

                    <!-- Section 9 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">9. Luật Áp Dụng</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Các điều khoản này được điều chỉnh và giải thích theo luật pháp Việt Nam. Mọi tranh chấp
                            phát sinh sẽ được giải quyết tại các tòa án có thẩm quyền tại Việt Nam.
                        </p>
                    </section>

                    <!-- Contact Section -->
                    <section class="p-6 rounded-lg" style="background: var(--bg-tertiary);">
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">Liên Hệ</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:
                        </p>
                        <div class="space-y-2" style="color: var(--text-secondary);">
                            <p><strong>Email:</strong> support@audiotruyen.vn</p>
                            <p><strong>Điện thoại:</strong> 1900-xxxx</p>
                            <p><strong>Địa chỉ:</strong> 123 Đường 3/2, Ninh Kiều, TP.Cần Thơ</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const lastUpdated = ref('06/12/2025');
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}

.page-container {
    min-height: 100vh;
    background: var(--bg-primary);
}

section {
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

section:last-of-type {
    border-bottom: none;
}

h2 {
    position: relative;
    padding-left: 1rem;
}

h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: var(--color-primary);
    border-radius: 2px;
}
</style>
