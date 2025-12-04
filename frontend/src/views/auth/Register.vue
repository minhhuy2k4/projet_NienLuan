<template>
    <div class="form-container">
        <div class="form-box animate-slide-up">
            <h2 class="animate-fade-in">Đăng ký</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group animate-slide-up animation-delay-100">
                    <label>Tên:</label>
                    <input type="text" v-model="name" required :disabled="loading"
                        class="focus:ring-2 focus:ring-blue-500 transition">
                </div>

                <div class="form-group animate-slide-up animation-delay-200">
                    <label>Email:</label>
                    <input type="email" v-model="email" required :disabled="loading"
                        class="focus:ring-2 focus:ring-blue-500 transition">
                </div>

                <div class="form-group animate-slide-up animation-delay-300">
                    <label>Mật khẩu:</label>
                    <div class="password-input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" required
                            :disabled="loading" class="focus:ring-2 focus:ring-blue-500 transition">
                        <button v-if="password" type="button" @click="showPassword = !showPassword"
                            class="password-toggle-btn">
                            <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
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

                <div class="form-group animate-slide-up animation-delay-400">
                    <label>Nhập lại mật khẩu:</label>
                    <div class="password-input-wrapper">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required
                            :disabled="loading" class="focus:ring-2 focus:ring-blue-500 transition">
                        <button v-if="confirmPassword" type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="password-toggle-btn">
                            <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
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

                <button type="submit"
                    class="submit-btn transform hover:scale-105 transition animate-slide-up animation-delay-500"
                    :disabled="loading">
                    {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
                </button>

                <div v-if="errorMessage" class="error-message animate-fade-in">
                    {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="success-message animate-fade-in">
                    {{ successMessage }}
                </div>
            </form>

            <p class="text-center animate-fade-in animation-delay-600">
                Đã có tài khoản?
                <router-link to="/login" class="hover:text-blue-700 transition">Đăng nhập</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    // Check if passwords match
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp!';
        loading.value = false;
        return;
    }

    console.log('Attempting to register:', { name: name.value, email: email.value });

    const result = await authStore.register(name.value, email.value, password.value);

    console.log('Register result:', result);

    loading.value = false;

    if (result.success) {
        successMessage.value = result.message + ' Đang chuyển đến trang đăng nhập...';
        setTimeout(() => router.push('/login'), 2000);
    } else {
        errorMessage.value = result.message;
    }
};
</script>

<style scoped>
/* Existing styles */
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
    box-sizing: border-box;
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

.submit-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background-color: var(--color-accent);
}

.submit-btn:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
    opacity: 0.6;
}

.error-message {
    color: var(--color-danger);
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
}

.success-message {
    color: var(--color-success);
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
}

.text-center {
    text-align: center;
    margin-top: 1rem;
    color: var(--text-secondary);
}

.text-center a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
}

.text-center a:hover {
    text-decoration: underline;
}
</style>