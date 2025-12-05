<template>
    <footer class="app-footer">
        <div class="footer-container">
            <!-- Logo & Giới thiệu -->
            <div class="footer-section">
                <h3 class="footer-logo"><img src="/favicon.ico" alt="AudioTruyen" class="footer-logo-icon" />
                    AudioTruyen</h3>
                <p class="footer-description">
                    Nền tảng nghe truyện audio online hàng đầu Việt Nam.
                    Hàng nghìn truyện hay, cập nhật liên tục.
                </p>
                <div class="social-links">
                    <a href="#" aria-label="Facebook">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <path
                                d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 4.84 3.44 8.84 8 9.8v-6.93H8.3v-2.87H10V9.5c0-1.7 1.02-2.63 2.58-2.63.75 0 1.54.13 1.54.13v1.7h-.87c-.86 0-1.12.53-1.12 1.07v1.3h1.9l-.3 2.87h-1.6V21.8c4.56-.96 8-4.96 8-9.8z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="YouTube">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <path
                                d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-1-1.7-1-2.1-1.1C16.7 2.2 12 2.2 12 2.2h-.1S7.3 2.2 4.4 2.7c-.4.1-1.3.1-2.1 1.1C1.4 5.4 1.2 7.1 1.2 7.1S1 9 1 10.9v2.2C1 15.1 1.2 17 1.2 17s.2 1.7.8 2.4c.8 1 1.9 1 2.4 1.1 1.8.3 8.6.3 8.6.3s4.7 0 7.6-.5c.4-.1 1.3-.1 2.1-1.1.6-.7.8-2.4.8-2.4s.2-1.9.2-3.8v-2.2c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.9l6.2 3.1-6.2 3.1z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="Instagram">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                            stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="#" aria-label="Twitter">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <path
                                d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 001.88-2.36 8.59 8.59 0 01-2.71 1.04 4.28 4.28 0 00-7.29 3.9A12.14 12.14 0 013 4.79a4.28 4.28 0 001.33 5.71c-.66-.02-1.28-.2-1.82-.5v.05a4.28 4.28 0 003.43 4.19c-.45.12-.93.14-1.42.05a4.28 4.28 0 003.99 2.97A8.58 8.58 0 012 19.54a12.09 12.09 0 006.56 1.92c7.87 0 12.18-6.52 12.18-12.18v-.56A8.72 8.72 0 0024 6.56a8.43 8.43 0 01-2.54.7z" />
                        </svg>
                    </a>
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
                    <li><router-link to="/faq">Câu hỏi thường gặp</router-link></li>
                    <li><router-link to="/contact">Liên hệ</router-link></li>
                    <li><a href="#terms">Điều khoản sử dụng</a></li>
                    <li><a href="#privacy">Chính sách bảo mật</a></li>
                </ul>
            </div>

            <!-- Liên hệ -->
            <div class="footer-section">
                <h4 class="footer-title">Liên Hệ</h4>
                <ul class="footer-contact">
                    <li>
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path
                                    d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </span>
                        <span>support@audiotruyen.vn</span>
                    </li>
                    <li>
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path
                                    d="M6.62 10.79a15.054 15.054 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21.62 2.38 13.93 2.38 4a1 1 0 011-1H7a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02L6.62 10.79z" />
                            </svg>
                        </span>
                        <span>0123 456 789</span>
                    </li>
                    <li>
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
                            </svg>
                        </span>
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
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    color: white;
    padding: 3rem 0 1rem;
    margin-top: 4rem;
    position: relative;
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
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-logo-icon {
    width: 28px;
    height: 28px;
    object-fit: cover;
    border-radius: 6px;
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
