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
                <input type="password" id="password" v-model="password" required
                    class="focus:ring-2 focus:ring-blue-500 transition">
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
    background: var(--white-color);
    padding: 2rem 2.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    color: var(--primary-text);
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 1rem;
}

.error-message {
    color: red;
    font-size: 0.9rem;
    text-align: center;
}

.success-message {
    color: green;
    font-size: 0.9rem;
    text-align: center;
}

.form-button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    background-color: var(--primary-blue);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.form-button:hover {
    background-color: var(--primary-blue-hover);
}

.form-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.form-link {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
}

.form-link a {
    color: var(--primary-blue);
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
    color: var(--text-muted);
    font-size: 0.9rem;
}
</style>