<template>
    <footer class="app-footer">
        <div class="footer-container">
            <!-- Logo & Giới thiệu -->
            <div class="footer-section">
                <h3 class="footer-logo">🎧 AudioTruyen</h3>
                <p class="footer-description">
                    Nền tảng nghe truyện audio online hàng đầu Việt Nam.
                    Hàng nghìn truyện hay, cập nhật liên tục.
                </p>
                <div class="social-links">
                    <a href="#" aria-label="Facebook">📘</a>
                    <a href="#" aria-label="YouTube">📹</a>
                    <a href="#" aria-label="Instagram">📷</a>
                    <a href="#" aria-label="Twitter">🐦</a>
                </div>
            </div>

            <!-- Liên kết -->
            <div class="footer-section">
                <h4 class="footer-title">Liên Kết</h4>
                <ul class="footer-links">
                    <li><router-link to="/">Trang chủ</router-link></li>
                    <li><router-link to="/categories">Thể loại</router-link></li>
                    <li><router-link to="/hot-stories">Truyện hot</router-link></li>
                    <li><router-link to="/new-stories">Truyện mới</router-link></li>
                </ul>
            </div>

            <!-- Hỗ trợ -->
            <div class="footer-section">
                <h4 class="footer-title">Hỗ Trợ</h4>
                <ul class="footer-links">
                    <li><a href="#faq">Câu hỏi thường gặp</a></li>
                    <li><a href="#contact">Liên hệ</a></li>
                    <li><a href="#terms">Điều khoản sử dụng</a></li>
                    <li><a href="#privacy">Chính sách bảo mật</a></li>
                </ul>
            </div>

            <!-- Liên hệ -->
            <div class="footer-section">
                <h4 class="footer-title">Liên Hệ</h4>
                <ul class="footer-contact">
                    <li>
                        <span class="icon">✉️</span>
                        <span>support@audiotruyen.vn</span>
                    </li>
                    <li>
                        <span class="icon">📞</span>
                        <span>0123 456 789</span>
                    </li>
                    <li>
                        <span class="icon">📍</span>
                        <span>123 Đường ABC, Quận 1, TP.HCM</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Copyright -->
        <div class="footer-bottom">
            <p>&copy; {{ currentYear }} AudioTruyen. All rights reserved.</p>
            <p>Made with ❤️ by AudioTruyen Team</p>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3rem 0 1rem;
    margin-top: 4rem;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.footer-section {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.footer-logo {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-description {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-links a {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.social-links a:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
}

.footer-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 0.5rem;
}

.footer-links,
.footer-contact {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li,
.footer-contact li {
    margin-bottom: 0.75rem;
}

.footer-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
}

.footer-links a:hover {
    color: white;
    transform: translateX(5px);
}

.footer-contact li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
}

.footer-contact .icon {
    width: 20px;
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.7);
}

.footer-bottom {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
}

.footer-bottom p {
    margin: 0.25rem 0;
}

/* Responsive */
@media (max-width: 768px) {
    .app-footer {
        padding: 2rem 0 1rem;
    }

    .footer-container {
        grid-template-columns: 1fr;
        padding: 0 1rem;
    }

    .footer-section {
        text-align: center;
    }

    .social-links {
        justify-content: center;
    }

    .footer-contact li {
        justify-content: center;
    }

    .footer-links a:hover {
        transform: translateX(0) scale(1.05);
    }
}
</style>
