<template>
    <div class="form-container">
        <form class="form-box animate-slide-up" @submit.prevent="handleLogin">
            <h2 class="animate-fade-in">Đăng nhập</h2>

            <div class="form-group animate-slide-up animation-delay-100">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" required
                    class="focus:ring-2 focus:ring-blue-500 transition">
            </div>

            <div class="form-group animate-slide-up animation-delay-200">
                <label for="password">Mật khẩu</label>
                <div class="password-input-wrapper">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required
                        class="focus:ring-2 focus:ring-blue-500 transition">
                    <button v-if="password" type="button" @click="showPassword = !showPassword"
                        class="password-toggle-btn">
                        <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    </button>
                </div>
            </div>

            <p v-if="errorMessage" class="error-message animate-fade-in">{{ errorMessage }}</p>

            <button type="submit"
                class="form-button transform hover:scale-105 transition animate-slide-up animation-delay-300"
                :disabled="loading">
                {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>

            <!-- Thêm divider -->
            <div class="login-divider animate-fade-in animation-delay-400">
                <span>hoặc</span>
            </div>

            <!-- Google Login Component -->
            <div class="animate-slide-up animation-delay-500">
                <GoogleLogin />
            </div>

            <div class="form-link animate-fade-in animation-delay-600">
                Chưa có tài khoản? <router-link to="/register" class="hover:text-blue-700 transition">Đăng ký
                    ngay</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import GoogleLogin from '@/components/GoogleLogin.vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = '';
    const success = await authStore.login(email.value, password.value);
    loading.value = false;

    if (success) {
        router.push('/');
    } else {
        errorMessage.value = 'Email hoặc mật khẩu không chính xác.';
    }
};
</script>

<style scoped>
/* Style chung cho Form */
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
    min-height: 70vh;
}

.form-box {
    background: var(--bg-card);
    padding: 2rem 2.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    border: 1px solid var(--border-color);
}

h2 {
    text-align: center;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 1rem;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
}

.password-input-wrapper {
    position: relative;
}

.password-input-wrapper input {
    padding-right: 2.5rem;
}

.password-toggle-btn {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.password-toggle-btn:hover {
    color: var(--color-primary);
    background: none !important;
    border: none !important;
}

.password-toggle-btn:focus {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

.password-toggle-btn:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

.password-toggle-btn:active {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

.error-message {
    color: var(--color-danger);
    font-size: 0.9rem;
    text-align: center;
}

.success-message {
    color: var(--color-success);
    font-size: 0.9rem;
    text-align: center;
}

.form-button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    background-color: var(--color-primary);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.form-button:hover {
    background-color: var(--color-accent);
}

.form-button:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
    opacity: 0.6;
}

.form-link {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.form-link a {
    color: var(--color-primary);
    font-weight: 700;
}

/* Google Login Styles */
.login-divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    text-align: center;
}

.login-divider::before,
.login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
}

.login-divider span {
    padding: 0 15px;
    color: var(--text-secondary);
    font-size: 0.9rem;
}
</style>