<template>
    <div class="page-container">
        <div class="max-w-4xl mx-auto py-12 px-4">
            <div class="rounded-2xl shadow-xl p-8 animate-fade-in" style="background: var(--bg-card);">
                <h1 class="text-4xl font-bold mb-6" style="color: var(--text-primary);">Chính Sách Bảo Mật</h1>
                <p class="text-sm mb-8" style="color: var(--text-secondary);">Cập nhật lần cuối: {{ lastUpdated }}</p>

                <div class="space-y-8">
                    <!-- Section 1 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">1. Giới Thiệu</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            AudioTruyen cam kết bảo vệ quyền riêng tư của người dùng. Chính sách bảo mật này giải thích
                            cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn sử
                            dụng dịch vụ của chúng tôi.
                        </p>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Bằng việc sử dụng AudioTruyen, bạn đồng ý với các điều khoản được mô tả trong chính sách bảo
                            mật này.
                        </p>
                    </section>

                    <!-- Section 2 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">2. Thông Tin Chúng Tôi
                            Thu Thập</h2>
                        <h3 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">2.1. Thông Tin Cá
                            Nhân</h3>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Khi bạn đăng ký tài khoản, chúng tôi có thể thu thập:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4 mb-6" style="color: var(--text-secondary);">
                            <li>Họ tên</li>
                            <li>Địa chỉ email</li>
                            <li>Số điện thoại (nếu cung cấp)</li>
                            <li>Ảnh đại diện (nếu tải lên)</li>
                            <li>Thông tin từ đăng nhập mạng xã hội (Google, Facebook)</li>
                        </ul>

                        <h3 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">2.2. Thông Tin Tự
                            Động</h3>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Khi bạn sử dụng dịch vụ, chúng tôi tự động thu thập:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4 mb-6" style="color: var(--text-secondary);">
                            <li>Địa chỉ IP</li>
                            <li>Loại trình duyệt và phiên bản</li>
                            <li>Hệ điều hành</li>
                            <li>Thời gian truy cập</li>
                            <li>Trang đã xem và tương tác</li>
                            <li>Cookie và dữ liệu theo dõi tương tự</li>
                        </ul>

                        <h3 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">2.3. Dữ Liệu Sử Dụng
                        </h3>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Lịch sử đọc truyện</li>
                            <li>Truyện yêu thích</li>
                            <li>Đánh giá và bình luận</li>
                            <li>Tìm kiếm và sở thích</li>
                        </ul>
                    </section>

                    <!-- Section 3 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">3. Cách Chúng Tôi Sử
                            Dụng Thông Tin</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi sử dụng thông tin của bạn để:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Cung cấp và duy trì dịch vụ</li>
                            <li>Cá nhân hóa trải nghiệm người dùng</li>
                            <li>Gửi thông báo về tài khoản và dịch vụ</li>
                            <li>Cải thiện và phát triển tính năng mới</li>
                            <li>Phân tích xu hướng và hành vi người dùng</li>
                            <li>Phát hiện và ngăn chặn gian lận, lạm dụng</li>
                            <li>Tuân thủ nghĩa vụ pháp lý</li>
                            <li>Gửi email marketing (chỉ khi bạn đồng ý)</li>
                        </ul>
                    </section>

                    <!-- Section 4 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">4. Chia Sẻ Thông Tin
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các
                            trường hợp sau:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li><strong>Với sự đồng ý của bạn:</strong> Khi bạn cho phép chia sẻ thông tin</li>
                            <li><strong>Nhà cung cấp dịch vụ:</strong> Các đối tác hỗ trợ hosting, phân tích, thanh toán
                            </li>
                            <li><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan chức năng</li>
                            <li><strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền lợi, tài sản và an toàn của chúng tôi
                                và người dùng</li>
                            <li><strong>Chuyển nhượng kinh doanh:</strong> Trong trường hợp sáp nhập, mua bán công ty
                            </li>
                        </ul>
                    </section>

                    <!-- Section 5 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">5. Bảo Mật Thông Tin
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của
                            bạn:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Mã hóa dữ liệu truyền tải (SSL/TLS)</li>
                            <li>Mã hóa mật khẩu (bcrypt)</li>
                            <li>Kiểm soát truy cập hạn chế</li>
                            <li>Giám sát và phát hiện xâm nhập</li>
                            <li>Sao lưu dữ liệu định kỳ</li>
                            <li>Đào tạo nhân viên về bảo mật</li>
                        </ul>
                        <p class="mt-4" style="color: var(--text-secondary);">
                            Tuy nhiên, không có phương thức truyền tải hoặc lưu trữ dữ liệu nào là 100% an toàn. Chúng
                            tôi không thể đảm bảo tuyệt đối an toàn dữ liệu của bạn.
                        </p>
                    </section>

                    <!-- Section 6 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">6. Cookies và Công Nghệ
                            Theo Dõi</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi sử dụng cookies và công nghệ tương tự để:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4 mb-4" style="color: var(--text-secondary);">
                            <li>Ghi nhớ thông tin đăng nhập</li>
                            <li>Lưu trữ sở thích người dùng</li>
                            <li>Phân tích lưu lượng truy cập</li>
                            <li>Cá nhân hóa nội dung và quảng cáo</li>
                        </ul>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Bạn có thể quản lý cookies thông qua cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng
                            đến trải nghiệm sử dụng.
                        </p>
                    </section>

                    <!-- Section 7 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">7. Quyền Của Bạn</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Bạn có các quyền sau đối với thông tin cá nhân của mình:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li><strong>Quyền truy cập:</strong> Yêu cầu xem thông tin chúng tôi lưu trữ về bạn</li>
                            <li><strong>Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông tin không chính xác</li>
                            <li><strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu của bạn</li>
                            <li><strong>Quyền phản đối:</strong> Từ chối xử lý dữ liệu cho mục đích cụ thể</li>
                            <li><strong>Quyền hạn chế:</strong> Yêu cầu hạn chế xử lý dữ liệu</li>
                            <li><strong>Quyền di chuyển:</strong> Nhận bản sao dữ liệu của bạn</li>
                            <li><strong>Quyền rút lại đồng ý:</strong> Hủy đồng ý đã cấp trước đó</li>
                        </ul>
                    </section>

                    <!-- Section 8 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">8. Lưu Trữ Dữ Liệu</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi lưu trữ thông tin của bạn:
                        </p>
                        <ul class="list-disc list-inside space-y-2 ml-4" style="color: var(--text-secondary);">
                            <li>Cho đến khi bạn yêu cầu xóa tài khoản</li>
                            <li>Trong khoảng thời gian cần thiết để cung cấp dịch vụ</li>
                            <li>Để tuân thủ nghĩa vụ pháp lý (thường là 5-7 năm)</li>
                            <li>Để giải quyết tranh chấp và thực thi thỏa thuận</li>
                        </ul>
                    </section>

                    <!-- Section 9 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">9. Người Dùng Trẻ Em
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Dịch vụ của chúng tôi không nhắm đến người dùng dưới 13 tuổi. Chúng tôi không cố ý thu thập
                            thông tin cá nhân của trẻ em. Nếu bạn là phụ huynh và phát hiện con bạn đã cung cấp thông
                            tin cho chúng tôi, vui lòng liên hệ để chúng tôi xóa thông tin đó.
                        </p>
                    </section>

                    <!-- Section 10 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">10. Liên Kết Bên Thứ Ba
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Dịch vụ của chúng tôi có thể chứa liên kết đến các trang web bên thứ ba. Chúng tôi không
                            chịu trách nhiệm về chính sách bảo mật hoặc nội dung của các trang web này. Chúng tôi khuyến
                            khích bạn đọc chính sách bảo mật của mỗi trang web bạn truy cập.
                        </p>
                    </section>

                    <!-- Section 11 -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">11. Thay Đổi Chính Sách
                        </h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho
                            bạn về những thay đổi quan trọng qua email hoặc thông báo trên trang web. Ngày "Cập nhật lần
                            cuối" ở đầu trang sẽ được thay đổi khi có cập nhật.
                        </p>
                    </section>

                    <!-- Contact Section -->
                    <section class="p-6 rounded-lg" style="background: var(--bg-tertiary);">
                        <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">12. Liên Hệ</h2>
                        <p class="mb-4" style="color: var(--text-secondary);">
                            Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện quyền của mình, vui lòng
                            liên hệ:
                        </p>
                        <div class="space-y-2" style="color: var(--text-secondary);">
                            <p><strong>Email:</strong> privacy@audiotruyen.vn</p>
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

h3 {
    position: relative;
    padding-left: 0.75rem;
}

h3::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: var(--color-secondary);
    border-radius: 2px;
}
</style>
